import React from 'react';
import ReactDOM from 'react-dom';

class Infinite extends React.Component {
  constructor(props) {
    super(props);

    this.shouldAnimate = false;
    this.hasRunScrollLoad = false;
  }

  _setItem(item, piece) {
    let workPiece = piece;
    if (!piece) {
      workPiece = this.props.setItem(item, this._getFreePiece(item));
    } else {
      this.props.setItem(item, workPiece);
    }
    workPiece.item = item;
    workPiece.isVisible = true;
    if (!piece) {
      this.renderedPieces[item.id] = workPiece;
      this.container.appendChild(workPiece.element);
    }
  }

  _resetItems() {
    this.renderedPieces = {};
    this.hasRunScrollLoad = false;
    this.piecePool = {};
    this.itemHeights = [];
    this.lastScroll = 0;

    const infinite = ReactDOM.findDOMNode(this.refs.infinite);
    // Scroll to the top of the element
    window.scrollTo(0, infinite.offsetTop);

    if (this.container) {
      infinite.removeChild(this.container);
    }
    this.container = document.createElement('div');
    infinite.appendChild(this.container);
  }

  /**
   * Retrieves a free piece or none if all taken
   */
  _getFreePiece(item) {
    let type = item.type;
    if (!this.piecePool[type]) this.piecePool[type] = [];
    let pool = this.piecePool[type];

    if (pool.length === 0) {
      return null;
    } else {
      return pool.pop();
    }
  }

  _recyclePiece(piece) {
    let item = piece.item;
    let type = item.type;
    if (!this.piecePool[type]) this.piecePool[type] = [];
    let pool = this.piecePool[type];

    if (this.renderedPieces[item.id]) {
      let piece = this.renderedPieces[item.id];
      piece.isVisible = false;
      this.props.setItem(item, piece, true);
      // let element = piece.element;
      // element.parentNode.removeChild(element);
      // delete this.renderedPieces[item.id];
      // pool.push(piece);
    }
  }

  componentDidMount() {
    this._resetItems();

    // Add animation frame for quick scroll checks
    this.shouldAnimate = true;
    this.handleAnimation = this._handleAnimation.bind(this);
    window.requestAnimationFrame(this.handleAnimation);

    for (let i = 0; i < this.props.items.length; ++i) {
      let item = this.props.items[i];
      this._setItem(item);
    }
  }

  componentWillUnmount() {
    this.shouldAnimate = false;
    this.renderedPieces = {};
  }

  componentDidUpdate() {
    // Items have been wiped
    if (!this.props.items || this.props.items.length === 0) {
      this._resetItems();
    }

    // Add new items
    let newAdded = false;
    for (let i = 0; i < this.props.items.length; ++i) {
      let item = this.props.items[i];
      if (!this.renderedPieces[item.id]) {
        newAdded = true;
        this._setItem(item);
      }
    }

    if (newAdded) {
      this.hasRunScrollLoad = false;
    }
  }

  _checkVisiblity() {
    let top = window.pageYOffset || document.documentElement.scrollTop;
    if (this.lastScroll === top) return;
    this.lastScroll = top;

    let bottom = top + window.innerHeight;

    for (let key in this.renderedPieces) {
      let piece = this.renderedPieces[key];
      let bounds = piece.element.getBoundingClientRect();
      let eleTop = bounds.top;
      let eleBot = bounds.bottom;

      // Recycle element if out of range else show
      if (eleBot < top || eleTop > bottom) {
        if (piece.isVisible) {
          this._recyclePiece(piece);
        }
      } else {
        if (!piece.isVisible) {
          console.log('reshow');
          this._setItem(piece.item, piece);
        }
      }
    }
  }

  _handleAnimation() {
    if (this.shouldAnimate) {
      const hasItems = this.props.items && this.props.items.length > 0;
      // Check if the page should load more items
      if (!this.hasRunScrollLoad && hasItems) {
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

      // Show or hide elements
      this._checkVisiblity();

      window.requestAnimationFrame(this.handleAnimation);
    }
  }

  render() {
    return (
      <div ref='infinite'>
        <div ref='spacerTop'></div>
        <div ref='spacerBottom'></div>
      </div>
    )
  }
}
Infinite.defaultProps = {
  bottomOffset: 300
}

export default Infinite;
