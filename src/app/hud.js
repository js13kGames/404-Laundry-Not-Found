import { GameObject, Scene, Text } from 'kontra';

export const HUD = (props) => {
  let go = GameObject(props);

  go.update = function (dt) {
    this.elapsedTime += dt;
    this.countdown -= dt;
    if (this.countdown < 0) {
      this.countdown = 0;
    }
    this.children.map(child => child.update && child.update(dt));
  }

  let score = Text({
    text: '404 Laundry Not Found',
    font: "12px 'Courier New', Courier, monospace",
    color: 'white',
    x: 12,
    y: 12,
    update: function (dt) {
      this.text = `score ${this.parent.score}`;
    }
  });

  let time = Text({
    text: '404 Laundry Not Found',
    font: "12px 'Courier New', Courier, monospace",
    color: 'white',
    x: props.width - 12,
    y: 12,
    textAlign: 'right',
    update: function (dt) {
      const minutes = Math.floor(Math.ceil(this.parent.countdown) / 60);
      const seconds = Math.ceil(this.parent.countdown) - minutes * 60;
      this.text = `time ${minutes}:${seconds <= 9 ? '0' : ''}${seconds}`;
    }
  });

  return Scene({
    name: 'title',
    children: [go, score, time],
    elapsedTime: props.elapsedTime,
    countdown: props.countdown,
    update: function (dt) {
      this.elapsedTime += dt;
      this.countdown -= dt;
      if (this.countdown < 0) {
        this.countdown = 0;
      }
    }
  });
}
