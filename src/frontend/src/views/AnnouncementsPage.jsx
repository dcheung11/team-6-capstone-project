import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button, Stack } from "@mui/material"
import { styled } from "@mui/material/styles"
import FavoriteIcon from "@mui/icons-material/Favorite"
import NavBar from "../components/NavBar";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  height: "100%",
}))

const DateAuthor = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[500],
  fontSize: "0.875rem",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}))

export default function AnnouncementPage() {
  const pastAnnouncements = [
    { id: 1, title: "Announcement 1", date: "10 Oct 21", author: "Jane Ostin" },
    { id: 2, title: "Announcement 2", date: "10 Oct 21", author: "Jane Ostin" },
    { id: 3, title: "Announcement 3", date: "10 Oct 21", author: "Jane Ostin" },
    { id: 4, title: "Announcement 4", date: "10 Oct 21", author: "Jane Ostin" },
    { id: 5, title: "Announcement 5", date: "10 Oct 21", author: "Jane Ostin" },
    { id: 6, title: "Announcement 6", date: "10 Oct 21", author: "Jane Ostin" },
  ]

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar />
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Main Announcement */}
        <Box sx={{ py: 6, flexGrow: 1 }}>
          <Typography variant="h3" align="center" gutterBottom>
            Announcement Title
          </Typography>
          <Typography align="center" color="text.secondary" gutterBottom>
            29 Oct 18, by Milan Obama
          </Typography>

          <Typography paragraph sx={{ mt: 4 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lectus amet, eu lacus viverra magna ullamcorper
            ultricies. Laoreet est molestie tellus, vulputat, vitae. Viverra vitae nunc molestie nec. Id orci tincidunt
            amet ullamcorper morbi mauris augue.
          </Typography>

          <Typography paragraph>
            Faucibus ornare tincidunt malesuada phasellus. Volutpat, est id tincidunt dolor eu. Enim dictum semean
            ultricies pharetra lorem leo cursus. Mollis dui turpis sed suscipit. Mauris vestibulum in phasellus velit
            morbi lobortis varius egestas posuere.
          </Typography>

          <Typography paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enim dapibus quis id convallis vitae auctor feugiat
            massa. Semper ac blandit neque vulputate tincidunt venenatis. Orci lectus enim nunc proin lobortis faucibus
            vulputate in consectetur.
          </Typography>
        </Box>
      </Container>

      {/* Past Announcements */}
      <Box sx={{ bgcolor: "#495965", py: 6, width: "100%", flexGrow: 1 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" color="common.white" gutterBottom sx={{ mb: 4 }}>
            Past Announcements
          </Typography>

          <Grid container spacing={3}>
            {pastAnnouncements.map((announcement) => (
              <Grid item xs={12} md={6} key={announcement.id}>
                <StyledCard>
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {announcement.title}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enim dapibus quis id convallis vitae
                      auctor feugiat massa
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <DateAuthor>
                        <FavoriteIcon sx={{ fontSize: 16 }} />
                        {announcement.date} by {announcement.author}
                      </DateAuthor>
                      <Button
                        variant="text"
                        sx={{
                          color: "primary.contrastText",
                          textDecoration: "underline",
                          "&:hover": {
                            backgroundColor: "transparent",
                            textDecoration: "none",
                          },
                        }}
                      >
                        READ MORE
                      </Button>
                    </Stack>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}