import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { HeaderDrawerProps } from "../../interfaces/props";
import { setCurrentNavItem } from "../../reducers/navbar";
import { useDispatch } from "react-redux";
import { useTheme } from "@mui/material/styles";


const HeaderDrawer = ({ handleDrawerToggle, navItems }: HeaderDrawerProps) => {
  const dispatch = useDispatch();
  const theme = useTheme();


  return (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h5" color="white" sx={{bgcolor:theme.palette.primary.main , py: 2 }}>
        Stock Picker
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item}
            disablePadding
            onClick={() => {
              dispatch(setCurrentNavItem(item));
            }}
          >
            <ListItemButton sx={{color:theme.palette.primary.main , textAlign: "center" }}>
              <ListItemText color="black" sx={{color:"black"}}primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default HeaderDrawer;
