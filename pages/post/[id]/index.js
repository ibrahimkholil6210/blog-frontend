import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  fetchPostAsync,
  createCommentAsync,
} from "../../../redux/slice/postSlice";
import { Button } from "../../../components/Button";
import mainStyles from "../../../styles/Main.module.css";
import styles from "../../../styles/Post.module.css";
import GetBack from "../../../components/GetBack";

function createTree(inputList) {
  var list = JSON.parse(JSON.stringify(inputList));
  var map = {},
    node,
    roots = [],
    i;

  for (i = 0; i < list.length; i += 1) {
    map[list[i].id] = i; // initialize the map
    list[i].children = []; // initialize the children
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node.parentId) {
      // if you have dangling branches check that map[node.parentId] exists
      list[map[node.parentId]].children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

const Post = () => {
  const router = useRouter();

  const post = useSelector((state) => state.post.singlePost);
  const loading = useSelector((state) => state.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!router.query.id) return;
    dispatch(fetchPostAsync(router.query.id));
  }, [router?.query?.id]);

  const handleSubmit = (values, ...rest) => {
    dispatch(
      createCommentAsync({
        postId: router.query.id,
        userName: values.userName,
        comment: values.comment,
        parentId: values.parentId,
      })
    );
    rest[0].resetForm();
  };

  const [commentTree, setCommentTree] = useState([]);

  useEffect(() => {
    if (!post?.comments) return;
    setCommentTree(createTree(post.comments));
  }, [post]);

  return (
    <div className={mainStyles.container}>
      <Head>
        <title>{post?.title || "Post"} | Next Blog App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={mainStyles.main}>
        <div className={mainStyles.minWidth}>
          <GetBack />
          {loading ? (
            <h1 className={mainStyles.title}>Loading...</h1>
          ) : (
            <>
              <h1 className={mainStyles.title}>{post.title}</h1>
              <p>{post.content}</p>
            </>
          )}
          <CreateComment handleSubmit={handleSubmit} />
          <Comments comments={commentTree} handleSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Post;

const CreateComment = ({
  handleSubmit,
  formLabel = "Add a Comment",
  isReplyForm,
  parentId,
}) => {
  const validationSchemas = Yup.object().shape({
    userName: Yup.string().required("UserName is required"),
    comment: Yup.string().required("Comment is required"),
  });

  return (
    <div className={`${!isReplyForm && styles.commentContainer}`}>
      <div className={styles.titleCommentArea}>{formLabel}</div>
      <Formik
        initialValues={{
          userName: "",
          comment: "",
          ...(isReplyForm && { parentId }),
        }}
        validationSchema={validationSchemas}
        onSubmit={handleSubmit}
      >
        {({ touched, errors }) => {
          return (
            <Form>
              <div className={mainStyles.inputRow}>
                <div className={mainStyles.label}>Name</div>
                <Field name="userName" />
                {errors.userName && touched.userName ? (
                  <div className={mainStyles.errorMessage}>
                    {errors.userName}
                  </div>
                ) : null}
              </div>
              <div className={mainStyles.inputRow}>
                <div className={mainStyles.label}>Comment</div>
                <Field name="comment" as="textarea" />
                {errors.comment && touched.comment ? (
                  <div className={mainStyles.errorMessage}>
                    {errors.comment}
                  </div>
                ) : null}
              </div>
              <Button label="Submit" type="submit" />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

const Comments = ({ comments, handleSubmit }) => {
  return (
    <div className={styles.commentWrapper}>
      {comments?.map((singleComment, index) => {
        return (
          <Comment
            singleComment={singleComment}
            key={singleComment.id || index}
            handleSubmit={handleSubmit}
          />
        );
      }).reverse()}
    </div>
  );
};

const Comment = ({ singleComment, handleSubmit, type }) => {
  const [currentReplyComment, setCurrentReplyComment] = useState(null);

  const nestedComment = (singleComment.children || []).map((comment) => {
    return (
      <div className={styles.nestedComment} key={comment.id}>
        <Comment
          singleComment={comment}
          type="child"
          handleSubmit={handleSubmit}
        />
      </div>
    );
  }).reverse();

  // Added :PL as placeholder to replace with AT
  const dayAndTime = dayjs(singleComment?.createdAt).format("MMM DD, YYYY :PL hh:mm A").replace(':PL','AT');


  return (
    <>
      <div
        className={`${styles.commentContainer} ${styles.singleComment} ${
          type === "child" ? styles.deemBg : ""
        }`}
      >
        <div className={styles.commentAvatarConteiner}>
          <div className={styles.avatar}>{singleComment.userName.slice(0, 1)}</div>
          <div className={styles.userInfoContainer}>
            <label>{singleComment.userName}</label>
            <div>{dayAndTime}</div>
          </div>
        </div>
        <div className={styles.singleComment}>{singleComment.comment}</div>
        <div
          className={styles.replyBtn}
          onClick={() =>
            setCurrentReplyComment(
              currentReplyComment === singleComment.id ? null : singleComment.id
            )
          }
        >
          {currentReplyComment === singleComment.id ? "Hide" : "Reply"}
        </div>
        {currentReplyComment === singleComment.id && (
          <CreateComment
            formLabel="Reply to this comment"
            isReplyForm
            parentId={singleComment.id}
            handleSubmit={handleSubmit}
          />
        )}
      </div>

      {nestedComment}
    </>
  );
};