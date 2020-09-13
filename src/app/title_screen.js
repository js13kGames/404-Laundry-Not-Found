import { GameObject, Scene, Text } from 'kontra';

export const TitleScreen = (props) => {

  let go = GameObject(Object.assign(props, {
    render: function () {
      this.draw();
      this.context.fillStyle = "gray";
      this.context.fillRect(0, 0, this.width, this.height);
    }
  }));

  let title = Text({
    text: '404 Laundry Not Found',
    font: "32px 'Courier New', Courier, monospace",
    color: 'white',
    x: props.width/2,
    y: 64,
    anchor: {x: 0.5, y: 0.5},
  });

  let back404 = Text({
    text: props.mainText,
    font: "72px 'Courier New', Courier, monospace",
    color: 'white',
    x: props.width/2,
    y: props.height/2,
    anchor: {x: 0.5, y: 0.5},
  });

  let cont = Text({
    text: 'Press [Enter] to start',
    font: "32px 'Courier New', Courier, monospace",
    color: 'white',
    x: props.width/2,
    y: props.height - 64,
    anchor: {x: 0.5, y: 0.5},
    dt: 0,
    alpha: 1,
    opacity: 1,
    update: function () {
      this.dt += 1 / 60;
      this.opacity -= 1 / 60;
      if (this.dt > 1) {
        this.dt = 0;
        this.opacity = 1;
      }
    },
  });

  return Scene({
    name: 'title',
    children: [go, title, back404, cont],
  })
}
