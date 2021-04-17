class PostComments {
  //use constructor to initialize class instance for every new instance
  constructor(postId) {
    this.postId = postId;
    this.postContainer = $(`#post-${postId}`);
    this.newCommentForm = $(`#post-${postId}-comments-form`);

    this.createComment(postId);

    let self = this;
    // call for existing comments
    $(" .delete-comment-button", this.postContainer).each(function () {
      self.deleteComment($(this));
    });
  }

  createComment(postId) {
    let pSelf = this;
    this.newCommentForm.submit(function (e) {
      e.preventDefault();
      let self = this;

      $.ajax({
        type: "POST",
        url: "/comments/create",
        data: $(self).serialize(),
        success: function (data) {
          let newComment = pSelf.newCommentDOM(data.data.comment);
          $(`#post-comments-${postId}`).prepend(newComment);
          pSelf.deleteComment($(" .delete-comment-button", newComment));

          // enable toggle like functionality on new comment
          new ToggleLike($(" .toggle-like-button", newComment));

          new Noty({
            theme: "relax",
            text: "Comment added!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  }

  newCommentDOM(comment) {
    return $(`<li id="comment-${comment._id}">
                        <p> 
                            <small>
                                <a class="delete-comment-button" href="/comments/destroy/${comment._id}">
                                <i class="fas fa-trash-alt"></i></a>
                            </small>
                              ${comment.content}
                              <br>
                            <small>
                              ${comment.user.name}
                            </small>
                            <small>
                              <a
                                class="toggle-like-button"
                                data-likes="0"
                                href="/likes/toggle/?id=${comment._id}&type=Comment"
                              >
                                0 Likes
                              </a>                
                            </small>
                        </p>    
                </li>`);
  }

  deleteComment(deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "GET",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#comment-${data.data.comment_id}`).remove();

          new Noty({
            theme: "relax",
            text: "Comment deleted",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  }
}
