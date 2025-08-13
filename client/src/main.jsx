
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryclient=new QueryClient()
createRoot(document.getElementById('root')).render(
 <ThemeProvider theme={theme}>
<QueryClientProvider client={queryclient}>
    <App />
   </QueryClientProvider>
  </ThemeProvider>,
)
