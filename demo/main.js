function runGame() {
  var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    parent: 'game',
    backgroundColor: 0xe9efec,
    scale: {
      mode: Phaser.Scale.NONE,
    },
    roundPixels: true,
    scene: [Load, Test]
  };

  new Phaser.Game(config);
}

window.onload = function () {
  runGame();
};
