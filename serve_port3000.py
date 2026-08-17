import http.server
import socketserver
import os

PORT = 3000
DIRECTORY = "/Users/SurfaceStudio/.gemini/antigravity/scratch/snowballos"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    # Allow address reuse
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
        print(f"Serving SnowballOS on http://localhost:{PORT}")
        httpd.serve_forever()
