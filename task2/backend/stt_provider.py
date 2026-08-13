import os
import time
import requests
from abc import ABC, abstractmethod
from typing import Tuple, Dict, Any, Optional

class SpeechToTextProvider(ABC):
    @abstractmethod
    def transcribe_audio(
        self, audio_bytes: bytes, filename: str = "audio.wav", language_code: str = "hi-IN"
    ) -> Tuple[str, float, bool, str]:
        """
        Transcribes audio bytes to text.
        Returns: (transcript, latency_ms, success, error_message)
        """
        pass

class SarvamSTTProvider(SpeechToTextProvider):
    def __init__(self, api_key: Optional[str] = None, endpoint: Optional[str] = None):
        self.api_key = api_key or os.getenv("SARVAM_API_KEY", "")
        self.endpoint = endpoint or os.getenv(
            "SARVAM_STT_ENDPOINT", "https://api.sarvam.ai/speech-to-text"
        )
        self.model = "saarika:v1"

    def transcribe_audio(
        self, audio_bytes: bytes, filename: str = "audio.wav", language_code: str = "hi-IN"
    ) -> Tuple[str, float, bool, str]:
        start_time = time.perf_counter()

        if not audio_bytes or len(audio_bytes) < 100:
            return "", 0.0, False, "Empty or audio payload too small."

        if not self.api_key:
            # Fallback for offline demo mode or when SARVAM_API_KEY is not configured
            elapsed_ms = (time.perf_counter() - start_time) * 1000.0
            return (
                "What is Hacker House Goa 2026 and how does the low latency RAG system work?",
                elapsed_ms,
                True,
                "Demo Fallback (No SARVAM_API_KEY provided)"
            )

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
                timeout=5.0
            )

            elapsed_ms = (time.perf_counter() - start_time) * 1000.0

            if response.status_code == 200:
                res_data = response.json()
                transcript = res_data.get("transcript", res_data.get("text", "")).strip()
                if transcript:
                    return transcript, elapsed_ms, True, ""
                return "", elapsed_ms, False, "Sarvam STT returned an empty transcript."
            else:
                return (
                    "",
                    elapsed_ms,
                    False,
                    f"Sarvam STT API returned status {response.status_code}: {response.text}"
                )

        except requests.exceptions.Timeout:
            elapsed_ms = (time.perf_counter() - start_time) * 1000.0
            return "", elapsed_ms, False, "Sarvam STT API request timed out (5.0s limit)."
        except Exception as e:
            elapsed_ms = (time.perf_counter() - start_time) * 1000.0
            return "", elapsed_ms, False, f"Sarvam STT connection failure: {str(e)}"
