var React = require('react-native');
var ReactART = require('ReactNativeART');
var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;
var {
  Surface,
  Shape
} = ReactART;
var Morph = require('art/morph/path');
var hexSvgs = [
  'M110 50 L162 80 L162 140 L110 170 L58 140 L58 80Z',
];
var hexPath = hexSvgs.map((svg) => Morph.Path(svg));
var square = Morph.Path()
  .move(100,0)
  .line(100,0)
  .line(0,100)
  .line(-100,0)
  .close();
hexPath.push(square);
var animationTest = React.createClass({
  getInitialState: function() {
    return {
      transition: Morph.Tween(hexPath[0], hexPath[1])
    };
  },
  componentWillMount: function() {
    this._current = 1;
  },
  componentDidMount: function() {
    this.animate(null, this.nextAnimation)
  },
  nextAnimation: function() {
    this._current += 1;
    if (this._current >= hexPath.length) return;
    this.setState({
      transition: Morph.Tween(hexPath[this._current - 1], hexPath[this._current])
    }, () => this.animate(null, this.nextAnimation))
  },
  animate: function(start, cb) {
    requestAnimationFrame((timestamp) => {
      if (!start) start = timestamp;
      var delta = (timestamp - start) / 1000;
      if (delta > 1) return cb();
      this.state.transition.tween(delta);
      this.setState(this.state);
      this.animate(start, cb);
    })
  },
  render: function() {
    return (
      <View style={styles.container}>
        <Surface width={width} height={height}>
          <Shape x={-100} y={100} d={this.state.transition} fill="#000" />
        </Surface>
      </View>
    );
  }
});
var styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
AppRegistry.registerComponent('animationTest', () => animationTest);