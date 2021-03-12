import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layouts/Spinner';
import PostItem from './PostItem';
import { getPosts } from '../../actions/post';

const Posts = ({ getPosts, authLoading, post: { posts, loading } }) => {
  useEffect(() => {
    getPosts();
  }, [authLoading]);

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Posts</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome to the Community!
      </p>
      {/* Post Form */}
      <div className='posts'>
        {posts.map(post => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
    </Fragment>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired, //ptfr
  post: PropTypes.object.isRequired, //ptor
  authLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  post: state.post,
  authLoading: state.auth.loading,
});

export default connect(mapStateToProps, { getPosts })(Posts);
