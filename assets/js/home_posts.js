{
  //method to submit form data for new post using AJAX
  let createPost = function () {
    let newPostForm = $("#new-post-form");

    newPostForm.submit(function (e) {
      e.preventDefault();

      $.ajax({
        type: "POST", //suspect
        url: "/posts/create",
        data: newPostForm.serialize(),
        success: function (data) {
          let newPost = newPostDOM(data.data.post); //suspect
          $("#posts-list-container>ul").prepend(newPost);
          deletePost($(" .delete-post-button", newPost));

          new PostComments(data.data.post._id);

          // enable toggle like functionality on new post
          new ToggleLike($(" .toggle-like-button", newPost));

          //Solution to Noty in AJAX here:
          //https://stackoverflow.com/questions/30736229/jquery-how-use-noty-plugin-in-ajax-function
          new Noty({
            theme: "relax",
            text: "Post created!",
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
  };

  // method to create a post in DOM
  let newPostDOM = function (post) {
    return $(`<li id="post-${post._id}" class="list-group-item">
                    <div>
                      <div>
                        <span><img src="${post.user.avatar}" alt="" width="20px" /></span>
                        &nbsp;&nbsp;
                        <span>${post.user.name}</span>
                      </div>
                      <div style="margin-top: 10px">                       
                        ${post.content}
                      </div>
                        <small>
                          <a
                            class="toggle-like-button"
                            data-likes="0"
                            href="/likes/toggle/?id=${post._id}&type=Post"
                          >
                            0 Likes
                          </a>&nbsp;
                          <span>
                            <a
                              href="#post-${post._id}-comments-form"
                              data-bs-toggle="collapse"
                              role="button"
                              aria-expanded="false"
                              aria-controls="collapseExample"
                              >Comment
                            </a>
                          </span>
                        </small>&nbsp;&nbsp;&nbsp;
                        <small>
                            <a class="delete-post-button" href="/posts/destroy/${post._id}">
                            <i class="fas fa-trash-alt"></i></a>
                        </small>
                    </div>
                    <div class="post-comments">                        
                            <form
                                id="post-${post._id}-comments-form"
                                action="/comments/create"
                                method="POST"
                                class="collapse"
                              >
                                <div class="row g-3 align-items-center">
                                  <div class="col-sm-10">
                                    <input
                                      type="text"
                                      name="content"
                                      placeholder="Type here to add comment..."
                                      required
                                      class="form-control"
                                    />
                                  </div>
                                  <input type="hidden" name="post" value="${post._id}" />
                                  <div class="col-auto">
                                    <span class="form-text"
                                      ><input
                                        class="btn btn-secondary"
                                        type="submit"
                                        value="Comment"
                                        style="width: 95px"
                                    /></span>
                                  </div>
                                </div>
                              </form>        
                        <div class="post-comments-list">
                            <ul id="post-comments-${post._id}" class="list-group">   
                            </ul>
                        </div>
                    </div> 
                </li>`);
  };

  // method to delete post from DOM
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();
      $.ajax({
        type: "GET",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#post-${data.data.post_id}`).remove();
          new Noty({
            theme: "relax",
            text: "Post deleted",
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
  };

  // Extend Ajax to delete links on existing posts (on page reload), and not just the new posts.
  let convertPostsToAjax = function () {
    $("#posts-list-container>ul>li").each(function () {
      let self = $(this);
      let deleteButton = $(" .delete-post-button", self);
      deletePost(deleteButton);

      // get the post id by splitting id attribute
      let postId = self.prop("id").split("-")[1];
      new PostComments(postId);
    });
  };

  createPost();
  convertPostsToAjax();
}
