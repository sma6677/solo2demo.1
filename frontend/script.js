

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const blogPostResponse = await fetch('/blogs/');
        if (!blogPostResponse.ok) {
            throw new Error('Failed to fetch blog posts');
        }
        const blogPosts = await blogPostResponse.json();

        await Promise.all(blogPosts.map(async (blogPost) => {
            const authorResponse = await fetch(`/users/getUserByID/${blogPost.author}`)
            if (!authorResponse.ok){
                throw new Error('Failed to fetch author details');
            }
            const  authData = await authorResponse.json();
            blogPost.authorName = authData.name;
        }));

        await Promise.all(blogPosts.map(async (blogPost) => {
            await Promise.all(blogPost.comments.map(async (comment) => {
                const userResponse = await fetch(`/users/getUserByID/${comment.user}`)
                if (!userResponse.ok){
                    throw new Error('Failed to fetch user details');
                }
                const userData = await userResponse.json();
                comment.username = userData.name;
            }))
        }));

        displayBlogPost(blogPosts);

    } catch (error) {
        console.error('Error fetching content', error.message);
    }

});

async function  displayBlogPost(blogPosts){
    const blogPostContainer = document.getElementById('blogPosts');
    blogPostContainer.innerHTML = '';

    blogPosts.forEach(blogPost => {

        const cardElement = document.createElement('div');

        const titleElement = document.createElement('h5');
        titleElement.textContent = blogPost.title;
        cardElement.appendChild(titleElement);

        const authorElement = document.createElement('p');
        authorElement.textContent = blogPost.authorName;
        cardElement.appendChild(authorElement);

        const contentElement = document.createElement('p');
        contentElement.textContent = blogPost.content;
        cardElement.appendChild(contentElement);

        const likesElement = document.createElement('p');
        likesElement.textContent = `Likes: ${blogPost.likes}`;
        cardElement.appendChild(likesElement);

        const commentsElement = document.createElement('ul');
        blogPost.comments.forEach(comment => {
            const commentItem = document.createElement('li');
            commentItem.textContent = `${comment.username}: ${comment.content}          ${comment.likes} Likes`
            commentsElement.appendChild(commentItem);
        });
        cardElement.appendChild(commentsElement);

        blogPostContainer.appendChild(cardElement);


    })

}