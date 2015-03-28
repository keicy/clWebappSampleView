var React = require('react');
var Request = require('superagent');

var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
          {this.props.text}
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment author={comment.author} text={comment.text}>
        </Comment>
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

React.render(
  <CommentBox url="http://127.0.0.1:3000/comments" pollInterval={3000} />,
  document.getElementById('content')
);