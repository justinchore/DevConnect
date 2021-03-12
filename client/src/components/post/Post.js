import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layouts/Spinner';
import { getPost } from '../../actions/post';

const Post = ({ getPost, post: { post, loading }, match, authLoading }) => {
  useEffect(() => {
    getPost(match.params.id);
  }, [authLoading]);

  return <div>single post</div>;
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  post: state.post,
  authLoading: state.auth.loading,
});

export default connect(mapStateToProps, { getPost })(Post);
