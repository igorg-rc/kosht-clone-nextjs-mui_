import axios from "axios"
import Link from "../../src/Link"
import { Item, SectionTitle } from "../../components/UI/UIUnits"
import { useTheme, makeStyles } from "@mui/styles"
import { Typography } from "@mui/material"
import Image from "next/image"
import { useRouter } from "next/router"
import moment from 'moment'
import 'moment/locale/en-gb'
import 'moment/locale/uk'
import Head from 'next/head'
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
// import { PostGeneralView } from "../../components/Post/Post"
import { useTranslation } from "next-i18next"

const API_LINK = "http://api.igt-webdev.site"
// const API_LINK = "https://kosht-api.herokuapp.com/api"

const useStyles = makeStyles(theme => ({
  main: {
    border: '1px solid #000',
  },
  
  linkText:{
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 200,
    fontFamily: 'Gilroy-Bold, sans-serif',
    color: theme.palette.text.primary
  },
  topBage: {
    fontSize: 12,
    fontWeight: 600,
    lineHeight: '150%',
    textAlign: 'left',
    fontFamily: 'Gilroy-Bold, sans-serif',
    margin: '3px 0'
    // border: '1px solid red'
  },
  categoryLink: {
    fontSize: 12,
    color: '#5669FF',
    textDecoration: 'none',
    fontWeight: 600,
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  date: {
    margin: '0 8px',
    color: '#B8B8B8',
    fontStyle: 'normal',
    fontWeight: 'normal'
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.primary.main, 
    '&:hover': {
      color: theme.palette.secondary.main,
      transition: '0.5s'
    }
  },
  textDescripton:{
    borderRadius: '5px',
    maxWidth: '100%',
    textAlign: 'left',
    fontSize: 14,
    fontStyle: 'normal',
    lineHeight: '160%',
    fontFamily: 'Roboto, sans-serif',
    color: '#2E3A59'
  }
}))


export default function PostsByTags({tag, posts}) {
  const theme = useTheme()
  const styles = useStyles()
  const router = useRouter()
  const { t } = useTranslation("common")

  return <>
    <Head>
      <title>{`${t("head.mainTitle")} | ${t("head.postsByTagDesc")}
       "${router.locale === "uk" ? tag.title_ua : tag.title_en}"`}</title>
      <meta name="description" content={posts?.map(i => i.title)} />
    </Head>
    {posts?.map(i => <Item style={{ border: '1px sold #000' }} key={i._id}>
      <div style={{ border: '1px sold #000', padding: '20px 0' }}>
      <Typography paragraph className={styles.topBage}>
        {i.categories.map(item => (
          <Link 
            key={item._id}
            href={`/category/${item.slug}`} 
            className={styles.categoryLink}
          >
            <span className="category-badge">
              {router.locale === "uk" ? item.title_ua :  item.title_en}
            </span>
          </Link>
        ))}
      <span className={styles.date}>
        {new Date(Date.now()).getDate() - new Date(i.createdAt).getDate()  < 30 ?
          (router.locale === "uk" ? 
            moment.utc(i.createdAt).local().locale('uk').fromNow() : 
            moment.utc(i.createdAt).local().locale('en-gb').fromNow()
          ) :
          moment.utc(i.createdAt).local().format('DD MMM YYYY')} 
      </span>   
    </Typography>  
      <SectionTitle link>
        <Link className={styles.link} href={`/${i.slug}`}>
          {i.title}
        </Link>
      </SectionTitle>
      <Typography 
        component="p" 
        className={styles.textDescripton}
      >{i.description}
      </Typography>
      {i.imgUrl && <Image src={i.imgUrl} />}
      </div>
    </Item>)} 
    </>
}


export async function getStaticPaths({locales})  {
  const res = await axios.get(`${API_LINK}/tags`)
  const categories = res.data
  
  const paths = categories.map(category => (
    { params: { slug: category.slug }, locale: "uk" },
    { params: { slug: category.slug }, locale: "en" }
  ))
  
  return {
    paths,
    fallback: 'blocking'
  }
}


export async function getStaticProps(context) {
  const slug = context.params.slug
  const postsList = await axios.get(`${API_LINK}/posts/tags/${context.params.slug}`)
  const posts = postsList.data
  const tagRes = await axios.get(`${API_LINK}/tags/slug/${slug}`)
  const tag = tagRes.data[0]

  return {
    props: { 
      tag,
      posts, 
    ...await serverSideTranslations(context.locale, ["common"]) 
    }
  }
}