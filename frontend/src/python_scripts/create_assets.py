from PIL import Image, ImageDraw

snake_img = Image.new('RGBA', (20, 20), (255, 0, 0, 0))
# Draw a green square to represent the snake segment
draw = ImageDraw.Draw(snake_img)
draw.rectangle([0, 0, 19, 19], fill='green')
snake_img.save('snake.png')

# Create a new image with a transparent background
food_img = Image.new('RGBA', (20, 20), (255, 0, 0, 0))
draw = ImageDraw.Draw(food_img)
draw.ellipse([0, 0, 19, 19], fill='red')

food_img.save('food.png')