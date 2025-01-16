import { Container, Typography, Button, Box } from "@mui/material";

const EmptyPortfolio = () => {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%", // Ensures the container takes the height of its parent
        textAlign: "center",
        margin: "auto",
      }}
    >
      <Typography variant="h3" gutterBottom>
        Build Your Stock Portfolio
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Search for stocks to add to your portfolio and track their performance.
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        {/* Add your Button or other content here if necessary */}
      </Box>
      <Typography variant="h6" gutterBottom>
        Get Started by Adding Stocks to Your Portfolio
      </Typography>
    </Container>
  );
};

export default EmptyPortfolio;
