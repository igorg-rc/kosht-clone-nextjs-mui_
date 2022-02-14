
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import Link from '../src/Link';
import { useRouter } from 'next/router';
// import { PostSeparateListIndex } from "../components/PostList/PostSeparateListIndex"
import useSWR from 'swr';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { SectionTitle } from '../components/UI/UIUnits';
import { Item } from '../components/UI/UIUnits';
import { Typography } from '@mui/material';
import { useState } from 'react';
import moment from 'moment'
import 'moment/locale/en-gb'
import 'moment/locale/uk'
import Head from 'next/head';
import Image from 'next/image';

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



const Index = ({posts, banners}) => {
  const router = useRouter()
  const styles = useStyles()
  const { t } = useTranslation("common")
  const [showMore, setShowMore] = useState(true)
  const [expanded, setExpanded] = useState(true)

  if (router.isFallback) {
    return <div>Loading...</div>
  }


  return (
    <>
    <Head>
      <title>{t("head.mainTitle")} | {t("head.indexTitle")}</title>
      <meta name="description" content={t("head.indexDescription")} />
      <meta name="keywords" content={t("head.indexKeywords")} />
    </Head>
    {banners?.map(i => (
      <div key={i._id} className='banner-img-holder'>
        <Image 
          layout='responsive'
          width={100}
          height={50}
          src={`http://193.46.199.82:5000/${i.imgUrl}`} 
          className='banner-img'
          alt={i.title}
        />
      </div>
    ))}
    {/* <PostSeparateListIndex
      label={router.locale === "uk" ? "Читайте також" : "Read more"}
      items={showMore ? mainNews.posts.slice(0, 5) : mainNews.posts.slice(0, mainNews.length)}
      showMore={showMore}
      expanded={expanded}
      toggleExpanded={() => setExpanded(!expanded)}
      toggleShowMore={() => setShowMore(!showMore)} 
    /> */}


    {posts ? posts.data.map(i => <Item style={{ border: '1px sold #000' }} key={i._id}>
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
    </Item>) : "postList.noPosts"} 
    </>
  );
}


export default Index

export async function getServerSideProps({ locale }) {
  const BASE_API_PATH = "http://193.46.199.82:5000/api"
  // const BASE_API_PATH = "https://kosht-api.herokuapp.com/api"
  const fetchedPosts = await axios.get(`${BASE_API_PATH}/posts`)  
  const posts = fetchedPosts.data
  const bannersRes = await axios.get(`http://193.46.199.82:5000/api/banners`)
  const banners = bannersRes.data.data
  const fetchedMainNews = await axios.get(`${BASE_API_PATH}/lists/slug/main-news`)
  const mainNews = fetchedMainNews.data

  return {
    props: {
      posts, 
      banners,
      ...await serverSideTranslations(locale, ['common']) } 
  }
}