import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { ListItemText } from "@mui/material";
import ob31 from "../assets/ob31.png";
import ob32 from "../assets/ob32.png";
import ob33 from "../assets/ob33.png";
import CopyBlock from "../components/CopyBlock";

const OnboardingPage3 = () => {

  return (
    <Box sx={{ Width: 900, margin: "auto", p: 3, bgcolor: "#f9fafb", borderRadius: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Create Cost & Usage Report
      </Typography>
      <Typography mb={3}>
        Create a Create Cost & Usage Report by following these steps
      </Typography>

      <List>
        {/* Step 1*/}
        <ListItem sx={{ alignItems: "flex-start", flexDirection: "column" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                bgcolor: "primary.main",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                mt: 0.6,
                fontSize: 14,
              }}
            >
              1
            </Box>
            <ListItemText
              primary={
                <>
                  Go to &nbsp;
                  <Button
                    variant="text"
                    
                    
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textTransform: "none", p: 0.6}}
                  >
                    Cost and Usage Reports 
                  </Button>
                   in the Billing DashBoard and click on Create Report
                </>
              }
            />
          </Box>
         
        </ListItem>

        {/* Step 2 */}
        <ListItem sx={{ alignItems: "flex-start", flexDirection: "column" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                bgcolor: "primary.main",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                mt: 0.6,
                fontSize: 14,
              }}
            >
              2
            </Box>
            <Typography>Name the report as shown below and select the include resource IDs checkbox</Typography>
          </Box>
          
        <Box sx={{ml:2}}>
         <CopyBlock value="ck-tuner-951485052809-hourly-cur"/>
         </Box>  
         <Box
    sx={{
      mt: 2,
      px: 2,
      py: 1,
      borderRadius: 1,
      bgcolor: "#f9f9f9",
      width: "100%",
    }}
  >
    <Typography variant="body2" sx={{ mb: 1, fontSize: "0.78rem", color: "text.secondary" }}>
      Ensure that the following configuration is checked
    </Typography>

    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      <Box
        component="span"
        sx={{
          width: 18,
          height: 18,
          borderRadius: "4px",
          backgroundColor: "#888",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: "bold",
          mr: 1,
        }}
      >
        ✓
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        <strong>Include Resource IDs</strong>
      </Typography>
    </Box>

    <Typography variant="body2" sx={{ mt: 3 }}>
      Click on <strong>Next</strong>
    </Typography>
  </Box>
  <img src={ob31} alt="" />
</ListItem>
        {/* Step 3 */}
        <ListItem sx={{ alignItems: "flex-start", flexDirection: "column" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                bgcolor: "primary.main",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                mt: 6,
              
                fontSize: 14,
              }}
            >
              3
            </Box>
            <Typography mt={6}>
            In
            <i> Configure S3 Bucket</i>,
provide the name of the S3 bucket that was created -
            </Typography>
          </Box>
          <Box
    sx={{
      mt: 2,
      px: 2,
      py: 1,
      borderRadius: 1,
      bgcolor: "#f9f9f9",
      width: "100%",
    }}
  >
    <Typography variant="body2" sx={{ mb: 1, fontSize: "0.78rem", color: "text.secondary" }}>
      Ensure that the following configuration is checked
    </Typography>

    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      <Box
        component="span"
        sx={{
          width: 18,
          height: 18,
          borderRadius: "4px",
          backgroundColor: "#888",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: "bold",
          mr: 2,
        }}
      >
        ✓
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        <strong>The following default policy will be applied to your bucket</strong>
      </Typography>
    </Box>

    <Typography variant="body2" sx={{ mt: 3 }}>
      Click on <strong>Save</strong>
    </Typography>
  </Box>
  <img src={ob32} alt="" />
      
        </ListItem>

        {/* Step 4 */}
<ListItem sx={{ alignItems: "flex-start", flexDirection: "column" }}>
  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
    <Box
      sx={{
        width: 24,
        height: 24,
        bgcolor: "primary.main",
        color: "#fff",
        fontWeight: "bold",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mr: 2,
        mt: 0.6,
        fontSize: 14,
      }}
    >
      4
    </Box>
    <Typography>
      In the <i>Delivery options</i> section, enter the below-mentioned Report path prefix – Now, click on Add permissions
    </Typography>
  </Box>

  {/* Report path prefix */}
  <Box sx={{ ml:4, width: "100%", mb: 2,mt:1 }}>
    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 ,ml:3}}>
      Report path prefix:
    </Typography>

    <CopyBlock value="275595855473" />
  </Box>

  {/* Additional Checks */}
  <Box
    sx={{
      width: "100%",
      bgcolor: "#f9f9f9",
      px: 2,
      py: 1.5,
      borderRadius: 1,
    }}
  >
    <Typography variant="body2" sx={{ fontSize: "0.78rem", color: "text.secondary", mb: 1 }}>
      Additionally, ensure that the following checks are in place
    </Typography>

    <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
      Time granularity:
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Box
        component="span"
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          border: "2px solid #555",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mr: 1.2,
        }}
      >
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "#555",
          }}
        />
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        Hourly
      </Typography>
    </Box>

    <Typography variant="body2" sx={{ fontSize: "0.78rem", color: "text.secondary", mb: 0.5 }}>
      Please make sure these checks are Enabled in <strong>Enable report data integration</strong> for:
    </Typography>

    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        component="span"
        sx={{
          width: 18,
          height: 18,
          borderRadius: "4px",
          backgroundColor: "#888",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: "bold",
          mr: 1,
        }}
      >
        ✓
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        Amazon Athena
      </Typography>
      
    </Box>
  </Box>
    <img src={ob33} alt="" />
</ListItem>



        {/* Step 5*/}
        <ListItem sx={{ alignItems: "flex-start", flexDirection: "column" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                bgcolor: "primary.main",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                mt: 0.6,
                fontSize: 14,
              }}
            >
              5
            </Box>
            <Typography>
            Click on <strong>Next</strong>
.
Now, review the configuration of the Cost and Usage Report. Once satisfied, click on <strong>Create Report</strong>
.
            </Typography>
          </Box>
        </ListItem>
      </List>
    </Box>
  );
};

export default OnboardingPage3;
