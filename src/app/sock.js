import { Sprite } from 'kontra';

export const SOCK_COLORS = [
  'red', 'green', 'blue', 'yellow', 'orange', 'white'
];

export const Sock = (properties) => {
  return Sprite(Object.assign(properties, {
    update: function (dt) {
      // wrap the sprite to the other side of the screen
      if (this.dx > 0 && this.x > this.worldWidth - this.width) {
        this.x -= this.x;
      }
      if (this.dx < 0 && this.x < 0) {
        this.x = this.worldWidth - this.x;
      }
      this.advance(dt);
    },
    render: function () {
      const colorIndex = SOCK_COLORS.indexOf(this.color);
      if (colorIndex === -1) {
        throw new Error(`Color "${this.color}" is not defined`);
      }
      const sourceX = 0 + colorIndex * this.width;
      const sourceY = 0;
      const sourceWidth = this.width;
      const sourceHeight = this.height;
      const destinationX = 0;
      const destinationY = 0; // sin function?
      const destinationWidth = sourceWidth * (this.scaleX > 0 ? this.scaleX : 1);
      const destinationHeight = sourceHeight * (this.scaleY > 0 ? this.scaleY : 1);
      this.context.drawImage(
        this.image,
        sourceX, sourceY, sourceWidth, sourceHeight,
        destinationX, destinationY, destinationWidth, destinationHeight
      );
    }
  }),
  );
}
