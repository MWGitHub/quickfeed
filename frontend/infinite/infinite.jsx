import React from 'react';
import ReactDOM from 'react-dom';

class Infinite extends React.Component {
  constructor(props) {
    super(props);

    this.shouldAnimate = false;
    this.hasRunScrollLoad = false;
    this.renderedItems = {};
  }

  componentDidMount() {
    this.shouldAnimate = true;
    this.hasRunScrollLoad = false;
    this.renderedItems = {};

    // Add animation frame for quick scroll checks
    this.handleAnimation = this._handleAnimation.bind(this);
    window.requestAnimationFrame(this.handleAnimation);


    // Generate the initial elements
    const container = ReactDOM.findDOMNode(this.refs.infinite);

    for (let i = 0; i < this.props.items.length; ++i) {
      let item = this.props.items[i];
      let data = this.props.setItem(item);
      this.renderedItems[item.id] = data;
      container.appendChild(data.element);
    }
  }

  componentWillUnmount() {
    this.shouldAnimate = false;
    this.renderedItems = {};
  }

  componentWillReceiveProps(newProps) {
  }

  componentDidUpdate() {
    // Items have changed
    const container = ReactDOM.findDOMNode(this.refs.infinite);

    let newAdded = false;
    for (let i = 0; i < this.props.items.length; ++i) {
      let item = this.props.items[i];
      // console.log(this.renderedItems[item.id], item.id);
      if (!this.renderedItems[item.id]) {
        newAdded = true;
        let data = this.props.setItem(item);
        this.renderedItems[item.id] = data;
        container.appendChild(data.element);
      }
    }

    if (newAdded) {
      this.hasRunScrollLoad = false;
    }
  }

  _handleAnimation() {
    if (this.shouldAnimate) {
      // Check if the page should load more items
      if (!this.hasRunScrollLoad) {
        const container = ReactDOM.findDOMNode(this.refs.infinite);
        let bottom = window.pageYOffset || document.documentElement.scrollTop;
        bottom += window.innerHeight;
        let elementBottom = container.offsetTop + container.offsetHeight;
        let space = elementBottom - bottom;

        if (space <= this.props.bottomOffset) {
          this.hasRunScrollLoad = true;
          this.props.onScrollLoad();
        }
      }

      window.requestAnimationFrame(this.handleAnimation);
    }
  }

  render() {
    return (
      <div ref='infinite'></div>
    )
  }
}
Infinite.defaultProps = {
  bottomOffset: 200
}

export default Infinite;
