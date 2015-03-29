var React = require('react');
var Request = require('superagent');

//var Scroll1 = require('react-infinity');
//var Scroll2 = require('react-infinite');
//var Scroll3 = require('react-infinite-scroll');

var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var ListGroup = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;



var Comment = React.createClass({
  render: function() {
    return (
      <ListGroupItem className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
          {this.props.text}
      </ListGroupItem>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
      return (
         <ListGroup>
           <Comment author={comment.author} text={comment.text}></Comment>
        </ListGroup>
      );
    });
    return (
      <div className="commentList">
          {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var CommentBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  handleCommentSubmit: function(comment) {
    Request
        .post(this.props.url)
        .send(comment)
        .end(function(err, res) {});
  },
  myFuncLoadCommentsFromServer: function() {
    Request
        .get(this.props.url)
        .end(function(err, res){this.setState({data: res.body})}.bind(this));
  },
  componentDidMount: function() {
    this.myFuncLoadCommentsFromServer();
    setInterval(this.myFuncLoadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
      <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      <CommentList data={this.state.data} />
      </div>
    );
  }
});

var commentBox = (
  <Grid>
    <Row className='show-grid'>
      <Col smOffset={2} sm={8} smOffset={2}>
        <CommentBox url="http://127.0.0.1:3000/comments" pollInterval={5000} />
      </Col>  
    </Row>    
  </Grid>
);

React.render(
  commentBox,
  document.getElementById('content')
);
