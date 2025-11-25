from PIL import Image
import os

# Paths
input_path = r"C:\Users\Prashant\.gemini\antigravity\brain\b5684800-b93a-454d-8d4a-6daeba6914c0\uploaded_image_1764066626494.png"
output_path = r"c:\projects\personal-projects\prashant-portfolio\public\avatar.png"

try:
    img = Image.open(input_path)
    # Approximate coordinates for the avatar based on the image layout
    # The image is likely a full screenshot. The avatar is on the right side.
    # Let's crop a generous square around the avatar area.
    # Assuming standard HD or similar aspect ratio.
    width, height = img.size
    
    # Avatar is roughly in the top right quadrant
    # Let's guess: left=55%, top=10%, right=95%, bottom=40%
    left = width * 0.55
    top = height * 0.08
    right = width * 0.95
    bottom = height * 0.35
    
    # Fine tuning based on visual inspection of typical layouts
    # The avatar is a 3D character sitting at a laptop.
    # We want the character + laptop.
    
    avatar_crop = img.crop((left, top, right, bottom))
    avatar_crop.save(output_path)
    print(f"Successfully saved avatar to {output_path}")
    
except Exception as e:
    print(f"Error: {e}")
