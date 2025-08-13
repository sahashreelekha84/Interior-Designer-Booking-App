import { Container } from '@mui/material';
import Header from './Header';

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <Container sx={{ mt: 4 }}>
        {children}
      </Container>
    </>
  );
};

export default MainLayout;
