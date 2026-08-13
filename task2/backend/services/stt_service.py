import os
import time
import requests
from abc import ABC, abstractmethod
from typing import Tuple, Dict, Any, Optional

from task2.backend.models.schemas import STTResponse, ErrorDetail

class SpeechToTextProvider(ABC):
    @abstractmethod
    def transcribe(
        self, audio_bytes: bytes, filename: str = "audio.wav", language_code: str = "hi-IN"
    ) -> STTResponse:
        """
        Transcribes audio bytes into text.
        Returns structured STTResponse.
        """
        pass

class SarvamSTTProvider(SpeechToTextProvider):
    def __init__(self, api_key: Optional[str] = None, endpoint: Optional[str] = None):
        self.api_key = api_key or os.getenv("SARVAM_API_KEY", "")
        self.endpoint = endpoint or os.getenv(
            "SARVAM_STT_ENDPOINT", "https://api.sarvam.ai/speech-to-text"
        )
        self.model = "saarika:v1"

    def is_configured(self) -> bool:
        return bool(self.api_key and self.api_key.strip())

    def transcribe(
        self, audio_bytes: bytes, filename: str = "audio.wav", language_code: str = "hi-IN"
    ) -> STTResponse:
        start_time = time.perf_counter()

        if not audio_bytes or len(audio_bytes) < 100:
            return STTResponse(
                success=False,
                provider="sarvam",
                stt_ms=0.0,
                error_code="INVALID_AUDIO",
                message="Empty or audio payload too small.",
                retryable=False
            )

        if not self.is_configured():
            elapsed_ms = (time.perf_counter() - start_time) * 1000.0
            return STTResponse(
                success=False,
                provider="sarvam",
                stt_ms=elapsed_ms,
                error_code="API_KEY_MISSING",
                message="SARVAM_API_KEY is not configured on the backend server.",
                retryable=False
            )

        # Retry logic: up to 2 attempts for transient errors
        max_attempts = 2
        last_error_code = "STT_ERROR"
        last_error_msg = ""
        retryable = False

        for attempt in range(1, max_attempts + 1):
            try:
                files = {
                    "file": (filename, audio_bytes, "audio/wav")
                }
                data = {
                    "model": self.model,
                    "language_code": language_code
                }
                headers = {
                    "api-subscription-key": self.api_key
                }

                response = requests.post(
                    self.endpoint,
                    headers=headers,
                    data=data,
                    files=files,
                    timeout=6.0
                )

                elapsed_ms = (time.perf_counter() - start_time) * 1000.0

                if response.status_code == 200:
                    res_data = response.json()
                    transcript = res_data.get("transcript", res_data.get("text", "")).strip()
                    if transcript:
                        return STTResponse(
                            success=True,
                            provider="sarvam",
                            transcript=transcript,
                            stt_ms=round(elapsed_ms, 2)
                        )
                    return STTResponse(
                        success=False,
                        provider="sarvam",
                        stt_ms=round(elapsed_ms, 2),
                        error_code="EMPTY_TRANSCRIPT",
                        message="Sarvam STT returned an empty transcript.",
                        retryable=True
                    )
                elif response.status_code in (401, 403):
                    return STTResponse(
                        success=False,
                        provider="sarvam",
                        stt_ms=round(elapsed_ms, 2),
                        error_code="AUTHENTICATION_FAILED",
                        message="Sarvam API key authentication failed.",
                        retryable=False
                    )
                elif response.status_code == 429:
                    return STTResponse(
                        success=False,
                        provider="sarvam",
                        stt_ms=round(elapsed_ms, 2),
                        error_code="RATE_LIMITED",
                        message="Sarvam API rate limit or quota exceeded.",
                        retryable=False
                    )
                else:
                    last_error_code = f"HTTP_{response.status_code}"
                    last_error_msg = f"Sarvam API returned HTTP {response.status_code}: {response.text[:200]}"
                    retryable = response.status_code >= 500

            except requests.exceptions.Timeout:
                elapsed_ms = (time.perf_counter() - start_time) * 1000.0
                last_error_code = "TIMEOUT"
                last_error_msg = "Sarvam STT API request timed out (6s limit)."
                retryable = True
            except Exception as e:
                elapsed_ms = (time.perf_counter() - start_time) * 1000.0
                last_error_code = "CONNECTION_ERROR"
                last_error_msg = f"Sarvam STT connection failure: {str(e)}"
                retryable = True

            if attempt < max_attempts and retryable:
                time.sleep(0.5)

        elapsed_ms = (time.perf_counter() - start_time) * 1000.0
        return STTResponse(
            success=False,
            provider="sarvam",
            stt_ms=round(elapsed_ms, 2),
            error_code=last_error_code,
            message=last_error_msg,
            retryable=retryable
        )


class ElevenLabsSTTProvider(SpeechToTextProvider):
    def __init__(self, api_key: Optional[str] = None, endpoint: Optional[str] = None):
        self.api_key = api_key or os.getenv("ELEVENLABS_API_KEY", "")
        self.endpoint = endpoint or os.getenv(
            "ELEVENLABS_STT_ENDPOINT", "https://api.elevenlabs.io/v1/speech-to-text"
        )
        self.model_id = "scribe_v1"

    def is_configured(self) -> bool:
        return bool(self.api_key and self.api_key.strip())

    def transcribe(
        self, audio_bytes: bytes, filename: str = "audio.wav", language_code: str = "hi-IN"
    ) -> STTResponse:
        start_time = time.perf_counter()

        if not audio_bytes or len(audio_bytes) < 100:
            return STTResponse(
                success=False,
                provider="elevenlabs",
                stt_ms=0.0,
                error_code="INVALID_AUDIO",
                message="Empty or audio payload too small.",
                retryable=False
            )

        if not self.is_configured():
            elapsed_ms = (time.perf_counter() - start_time) * 1000.0
            return STTResponse(
                success=False,
                provider="elevenlabs",
                stt_ms=elapsed_ms,
                error_code="API_KEY_MISSING",
                message="ELEVENLABS_API_KEY is not configured on the backend server.",
                retryable=False
            )

        max_attempts = 2
        last_error_code = "STT_ERROR"
        last_error_msg = ""
        retryable = False

        for attempt in range(1, max_attempts + 1):
            try:
                files = {
                    "file": (filename, audio_bytes, "audio/wav")
                }
                data = {
                    "model_id": self.model_id
                }
                headers = {
                    "xi-api-key": self.api_key
                }

                response = requests.post(
                    self.endpoint,
                    headers=headers,
                    data=data,
                    files=files,
                    timeout=8.0
                )

                elapsed_ms = (time.perf_counter() - start_time) * 1000.0

                if response.status_code == 200:
                    res_data = response.json()
                    transcript = res_data.get("text", res_data.get("transcript", "")).strip()
                    if transcript:
                        return STTResponse(
                            success=True,
                            provider="elevenlabs",
                            transcript=transcript,
                            stt_ms=round(elapsed_ms, 2)
                        )
                    return STTResponse(
                        success=False,
                        provider="elevenlabs",
                        stt_ms=round(elapsed_ms, 2),
                        error_code="EMPTY_TRANSCRIPT",
                        message="ElevenLabs STT returned an empty transcript.",
                        retryable=True
                    )
                elif response.status_code in (401, 403):
                    return STTResponse(
                        success=False,
                        provider="elevenlabs",
                        stt_ms=round(elapsed_ms, 2),
                        error_code="AUTHENTICATION_FAILED",
                        message="ElevenLabs API key authentication failed.",
                        retryable=False
                    )
                elif response.status_code == 429:
                    return STTResponse(
                        success=False,
                        provider="elevenlabs",
                        stt_ms=round(elapsed_ms, 2),
                        error_code="RATE_LIMITED",
                        message="ElevenLabs API rate limit or quota exceeded.",
                        retryable=False
                    )
                else:
                    last_error_code = f"HTTP_{response.status_code}"
                    last_error_msg = f"ElevenLabs API returned HTTP {response.status_code}: {response.text[:200]}"
                    retryable = response.status_code >= 500

            except requests.exceptions.Timeout:
                elapsed_ms = (time.perf_counter() - start_time) * 1000.0
                last_error_code = "TIMEOUT"
                last_error_msg = "ElevenLabs STT API request timed out (8s limit)."
                retryable = True
            except Exception as e:
                elapsed_ms = (time.perf_counter() - start_time) * 1000.0
                last_error_code = "CONNECTION_ERROR"
                last_error_msg = f"ElevenLabs STT connection failure: {str(e)}"
                retryable = True

            if attempt < max_attempts and retryable:
                time.sleep(0.5)

        elapsed_ms = (time.perf_counter() - start_time) * 1000.0
        return STTResponse(
            success=False,
            provider="elevenlabs",
            stt_ms=round(elapsed_ms, 2),
            error_code=last_error_code,
            message=last_error_msg,
            retryable=retryable
        )


class STTServiceManager:
    def __init__(self):
        self.sarvam_provider = SarvamSTTProvider()
        self.elevenlabs_provider = ElevenLabsSTTProvider()

    def get_provider_status(self) -> Dict[str, bool]:
        return {
            "sarvam_configured": self.sarvam_provider.is_configured(),
            "elevenlabs_configured": self.elevenlabs_provider.is_configured()
        }

    def transcribe(
        self,
        provider_name: str,
        audio_bytes: bytes,
        filename: str = "audio.wav",
        language_code: str = "hi-IN"
    ) -> STTResponse:
        provider_key = (provider_name or "sarvam").lower().strip()

        if provider_key == "sarvam":
            return self.sarvam_provider.transcribe(audio_bytes, filename, language_code)
        elif provider_key in ("elevenlabs", "eleven_labs"):
            return self.elevenlabs_provider.transcribe(audio_bytes, filename, language_code)
        elif provider_key == "browser":
            # Browser STT is handled client-side
            return STTResponse(
                success=False,
                provider="browser",
                stt_ms=0.0,
                error_code="BROWSER_STT_CLIENT_SIDE",
                message="Browser STT transcript is generated client-side. No backend API request required.",
                retryable=False
            )
        else:
            return STTResponse(
                success=False,
                provider=provider_key,
                stt_ms=0.0,
                error_code="UNKNOWN_PROVIDER",
                message=f"Unsupported STT provider '{provider_name}'. Choose 'browser', 'sarvam', or 'elevenlabs'.",
                retryable=False
            )
