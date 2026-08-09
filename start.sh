#!/bin/bash
# ACCESS - Start both backend and frontend together
# Usage: ./start.sh  (from the Hack_ 3 root)

PROJECT_ROOT="$(cd "$(dirname "$0")/ACCESS_Main_Project" && pwd)"

echo "🚀 Starting ACCESS Backend (port 8000)..."
cd "$PROJECT_ROOT/module_3_backend"
python main.py &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait a moment for the backend to boot
sleep 3

echo "🎨 Starting ACCESS Frontend (port 5173)..."
cd "$PROJECT_ROOT/module_1_frontend"
npm run dev &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

echo ""
echo "✅ Both servers running!"
echo "   Frontend → http://localhost:5173"
echo "   Backend  → http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both."

# Wait and clean up on exit
trap "echo '⛔ Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT INT TERM
wait
