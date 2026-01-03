# StressDetector
Stress Detector Web Application

A real-time Stress Detection Web App that uses computer vision to analyze facial movements through a webcam and estimate stress levels.
The application categorizes stress into calm, tensed, and highly stressed states, provides suggestions, and maintains stress history.

✨ Features
🎥 Live Camera Capture
⏱️ 30-second automatic stress analysis
🛑 Manual Stop Camera option
📊 Stress Level Detection
🎨 Color-coded stress indicator
💡 Personalized stress suggestions
📈 Average Stress Calculation
⏰ Last Check Timestamp
🗂️ History of last 50 stress records
🌙 Dark theme UI

Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/stress-detector.git
cd stress-detector

2️⃣ Install Dependencies
pip install flask flask-sqlalchemy mediapipe numpy pillow pytz

3️⃣ Run the Application
python app.py

4️⃣ Open in Browser
http://localhost:5000

-How It Works
1)User clicks Start Camera
2)Webcam runs for 30 seconds
3)Facial landmarks (nose movement) are tracked using MediaPipe
4)Movement intensity is analyzed:
5)Final stress score is calculated
6)UI updates
7)Stress value is stored in the database

🧪 Known Limitations
.Stress is inferred from facial movement (not medical-grade)
.Lighting conditions can affect accuracy
.Not a substitute for professional diagnosis

🌱 Future Enhancements
.Eye blink detection (true blink rate)
.Emotion recognition
.Stress trend charts
.Calibration mode
.Breathing animation guidance
.Mobile optimization
