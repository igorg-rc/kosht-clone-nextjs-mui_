import axios from "axios"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import useSWR from "swr"
import { Item } from "./UIUnits"
import { makeStyles, styled } from "@mui/styles"
import { Typography, Tabs, Tab, Table, TableHead, TableCell, TableBody, TableRow, Box } from "@mui/material"
import { useState } from "react"
import { currenciesGeneralList } from "../../files/data/mocData"
import { RightMenuPostList } from "../PostList/PostLists"

const useStyles = makeStyles(theme => ({
  main: {
    background: '#FFFFFF',
    minHeight: '10vh',
    boxShadow: '0px 8px 25px rgba(83, 89, 144, 0.07)',
    borderRadius: '6px',
    padding: '10px 0',
    '&:hover': {
      cursor: 'pointer'
    },
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Play, sans-serif',
    fontWeight: 800,
    paddingBottom: 5
  },
  currenciesList: {
    textAlign: 'left',
    padding: '0',
    margin: '0 0 0 10px',
    fontSize: 14,
    fontFamily: 'Play, sans-serif'
  },
  linkToCurrencies: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    margin: '0 0 0 10px',
    fontSize: 14,
    paddingTop: 3,
    '&:hover': {
      cursor: 'pointer'
    }
  },
  linkText: {
    fontWeight: 600,
    fontFamily: 'Play, sans-serif',
    '&:hover': {
      textDecoration: 'underline'
    },
    postTitleDiv: {
      border: '1px solid rgb(0,0,0, 0.15)',
      background: 'red',
      backgroundColor: 'darkgreen', 
      margin: 0, 
      padding: 0
    },
  },
  arrowIcon: {
    fontSize: 17
  },
  tableRegularText: {
    fontSize: 12,
    fontWeight: 'normal',
    fontFamily: 'Roboto, sans-serif'
  },
  tableBoldText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Gilroy, sans-serif'
  },
  tableHeadRow: {
  },
  tableHeadCell: {
    padding: 0,
  },
  tableHeadCellRight: {
    textAlign: 'right',
  },
  tableBodyCell: {
    padding: 0, 
    minWidth: 20,
    borderBottom: 'none'
  },
  tabPanel: {
    marginLeft: 0,
    margin: '0 0px',
    minWidth: '245px' 
  },
  tableRowText: {
    fontSize: 11,
    margin: '5px 0'
  },
  linkHolder: {
    textAlign: 'left',
    color: theme.palette.text.secondary,
    fontFamily: 'Gilroy, sans-serif',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 14,
    lineHeight: '150%',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  linkLine: {
    borderBottom: '2px',
    borderBottomStyle: 'solid',
    borderBottomWidth: '2px',
    borderBottomLeftRadius: '2px',
    borderBottomRightRadius: '2px',
    
  }
}))

const TabPanel = ({ children, tab, index, ...other }) => {
  const styles = useStyles()
  return <div 
    id={`simple-tabpanel-${index}`} 
    role="tabpanel" 
    hidden={tab !== index} 
    aria-labelledby={`simple-tab-${index}`} 
    {...other} 
    className={styles.tabPanel}
    >
    {tab === index && (<Box sx={{ p: 3 }}><Typography>{children}</Typography></Box>)}
  </div>
}

const StyledTabs = styled(Tabs)({
  '& .MuiTabs-indicator': { backgroundColor: '#5669FF' },
  '& .MuiTabs': { width: 30 }
})

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    fontFamily: 'Gilroy, sand-serif',
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: '150%',
    marginRight: theme.spacing(0),
    minWidth: 50,
    width: 50,
    color: '#2E3A59',
    opacity: 1,
    left: 0,
    marginLeft: -7,
    marginRight: 9,
    marginTop: -10,
    paddingBottom: -20,
    '&.Mui-selected': {
      color: '#5669FF',
      borderBottom: 'none',
      fontWeight: 600,
    },
    // '&.MuiTabs-indicator': {
    //   color: 'red',
    // },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
  }),
);


export const RightMenu = props => {

  const [tab, setTab] = useState(0)
  const handleChange = (event, newValue) => setTab(newValue)
  const router = useRouter()
  const styles = useStyles()
  const { t } = useTranslation('common')
  // const BASE_API_PATH = "https://193.46.199.82:5000/api"
  const BASE_API_PATH = "https://kosht-api.herokuapp.com/api"
  const EDITOR_CHOICE_URL = `${BASE_API_PATH}/lists/slug/editor-choice`
  const ALL_POSTS_URL = `${BASE_API_PATH}/posts`
  const fetcher = url => axios.get(url).then(res => res.data).catch(err => console.log(err))

  const {data: news, error: newsError} = useSWR(ALL_POSTS_URL, fetcher)
  const {data: editorChoice, error: editorChoiceError} = useSWR(EDITOR_CHOICE_URL, fetcher)

  const currenciesList = <div id="euro-tab-table_general" style={{ padding: "20px 0" }}>
  <>
    <StyledTabs value={tab} onChange={handleChange} aria-label="basic tabs example">
      <StyledTab label={t("separateList.currencyEuro")} />
      <StyledTab label={t("separateList.currencyUSD")} />
    </StyledTabs>
  </>
  <TabPanel tab={tab} index={0} className={styles.tabPanel}>
    <Table className="currencies-bage">
      <TableHead>
        <TableRow className={styles.tableHeadRow}>
          <TableCell className={styles.tableHeadCell}>
            <Typography className={`${styles.tableRowText} ${styles.tableBoldText}`}>
              {t("separateList.currencyBank")}
            </Typography>
          </TableCell>
          <TableCell className={styles.tableHeadCell}>
            <Typography className={`${styles.tableRowText} ${styles.tableBoldText} ${styles.tableHeadCellRight}`}>
            {t("separateList.currencyBuy")}
            </Typography>
          </TableCell>
          <TableCell className={styles.tableHeadCell}>
            <Typography className={`${styles.tableRowText} ${styles.tableBoldText} ${styles.tableHeadCellRight}`}>
            {t("separateList.currencySelling")}
            </Typography>
          </TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {currenciesGeneralList.banks?.map((item, index) => (
        <TableRow key={index}>
          <TableCell className={styles.tableBodyCell}>
            <Typography className={`${styles.tableRowText} ${styles.tableRegularText}`}>
              {router.locale === "uk" ? item.bank_title_ua : item.bank_title_en}
            </Typography>
          </TableCell>
          <TableCell className={`${styles.tableBodyCell} ${styles.tableHeadCellRight}`}>
            <Typography className={`${styles.tableRowText} ${styles.tableBoldText}`}>{(item.usd_byeRate).toFixed(2)}</Typography>
          </TableCell>
          <TableCell className={`${styles.tableBodyCell} ${styles.tableHeadCellRight}`}>
            <Typography className={`${styles.tableRowText} ${styles.tableBoldText}`}>{(item.usd_sellRate).toFixed(2)}</Typography>
          </TableCell>
        </TableRow>
        ))}
        
      </TableBody>
    </Table>
  </TabPanel>
  <TabPanel tab={tab} index={1} className={styles.tabPanel}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell className={styles.tableHeadCell}>
            <Typography className={`${styles.tableRowText} ${styles.tableBoldText}`}>
            {t("separateList.currencyBank")}
            </Typography>
          </TableCell>
          <TableCell className={styles.tableHeadCell}>
            <Typography className={`${styles.tableRowText} ${styles.tableBoldText} ${styles.tableHeadCellRight}`}>
            {t("separateList.currencyBuy")}
            </Typography>
          </TableCell>
          <TableCell className={styles.tableHeadCell}>
            <Typography className={`${styles.tableRowText} ${styles.tableBoldText} ${styles.tableHeadCellRight}`}>
            {t("separateList.currencySelling")}
            </Typography>
          </TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {currenciesGeneralList.banks.map((item, index) => (
        <TableRow key={index}>
          <TableCell className={styles.tableBodyCell}>
            <Typography className={[styles.tableRowText, styles.tableRegularText].concat(" ")}>
            {router.locale === "uk" ? item.bank_title_ua : item.bank_title_en}
            </Typography>
          </TableCell>
          <TableCell className={styles.tableBodyCell}>
            <Typography className={[styles.tableRowText, styles.tableBoldText, styles.tableHeadCellRight].concat(" ")}>{(item.euro_byeRate).toFixed(2)}</Typography>
          </TableCell>
          <TableCell className={styles.tableBodyCell}>
            <Typography className={[styles.tableRowText, styles.tableBoldText, styles.tableHeadCellRight].concat(" ")}>{(item.euro_sellRate).toFixed(2)}</Typography>
          </TableCell>
        </TableRow>
        ))}
      </TableBody>
    </Table>
  </TabPanel>
    <div 
      className={styles.linkHolder}
      onClick={() => router.replace('/currencies')}
    ><span className={styles.linkLine}>{t("separateList.allCurrenciesLink")}</span>
    </div>
</div> 


  return router.pathname.includes('currencies') ? 
  <>
    <RightMenuPostList 
      label={editorChoice && (router.locale === "uk" ? "Новини" : "News")}
      items={news && news.data.slice(0, 20)} 
    />
  </> :
  <>
    <Item>{currenciesList}</Item>
    <RightMenuPostList 
      label={editorChoice && (router.locale === "uk" ? editorChoice.title_ua : editorChoice.title_en)}
      items={editorChoice && editorChoice.posts} 
    />
  </>
}