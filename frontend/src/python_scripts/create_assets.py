from PIL import Image, ImageDraw

snake_img = Image.new('RGBA', (20, 20), (255, 0, 0, 0))
# green transparent square for snake
draw = ImageDraw.Draw(snake_img)
draw.rectangle([0, 0, 19, 19], fill='green')
snake_img.save('snake.png')

# red transparect circle for food
food_img = Image.new('RGBA', (20, 20), (255, 0, 0, 0))
draw = ImageDraw.Draw(food_img)
draw.ellipse([0, 0, 19, 19], fill='red')
food_img.save('food.png')

# white transparent square for obstacle
obstacle_img = Image.new('RGBA', (20, 20), (255, 255, 255, 0))
draw = ImageDraw.Draw(food_img)
draw.rectangle([0, 0, 19, 19], fill='white')
food_img.save('obstacle.png')