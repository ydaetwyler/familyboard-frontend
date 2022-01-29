import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { CookiesProvider } from 'react-cookie'
import { 
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink,
} from "@apollo/client"
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'

const baseUrl = process.env.REACT_APP_BASE_URL

const httpLink = new HttpLink({
  uri: baseUrl,
  credentials: 'include',
})

const subscribeUrl = process.env.REACT_APP_SUBSCRIBE_URL

const wsLink = new WebSocketLink({
  uri: subscribeUrl,
  options: {
    reconnect: true,
    connectionParams: {
      credentials: 'include'
    }
  }
})

// Manage use of http or ws as needed
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink,
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
})

// Surround App with Apollo & Cookie provider
ReactDOM.render(
  <ApolloProvider client={client}>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </ApolloProvider>,
  document.getElementById('root')
)
