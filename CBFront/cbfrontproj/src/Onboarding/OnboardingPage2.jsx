import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
} from "@mui/material";

import ob21 from "../assets/ob21.png"
import ob22 from "../assets/ob22.png"
import ob23 from "../assets/ob23.png"
import ob24 from "../assets/ob24.png"
import JsonViewerWithCopy from '../components/JsonViewerWithCopy'; 
import { initialPolicies, additionalPolicy } from "../components/policySnippets";
import CopyBlock from "../components/CopyBlock";

const OnboardingPage2 = () => {
  return (
    <Box sx={{ Width: 900, margin: "auto", p: 3, bgcolor: "#f9fafb", borderRadius: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add Customer Managed Policies
      </Typography>
      <Typography mb={3}>
        Create an inline policy for the role by following these steps
      </Typography>
      <List disablePadding>
        {initialPolicies.map((policy, index) => {
          const stepBase = index * 3 + 1;
          return (
            <React.Fragment key={index}>
              {[1, 4, 7].includes(stepBase) && (
                <ListItem sx={{ alignItems: "flex-start" }}>
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
                    {stepBase}
                  </Box>

                  <ListItemText
                    primary={
                      <>
                        {stepBase === 1 ? "Go to the " : "Again, go to the "}
                        <Button
                          variant="text"
                          size="small"
                          href="https://console.aws.amazon.com/iam/home#/policies$new?step=edit"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ textTransform: "none", p: 0 }}
                        >
                          Create Policy
                        </Button>{" "}
                        Page.
                      </>
                    }
                  />
                </ListItem>
              )}

              {/* Step 2/5/8...: Paste JSON */}
              <ListItem sx={{ alignItems: "flex-start" }}>

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
                  {stepBase + 1}
                </Box>
                <ListItemText
                  primary={
                    <>
                      Click on the <code>JSON</code> tab and paste the following policy and click on Next:
                      <JsonViewerWithCopy jsonText={policy.json} />
                    </>
                  }
                />
              </ListItem>

              {/* Step 3/6/9...: Policy Name */}
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
                    {stepBase + 2}
                  </Box>
                  <Typography>
                    In the <code>Name</code> field, enter the below-mentioned policy name and click on Create Policy:
                  </Typography>
                </Box>
                <Box sx={{ mt: 1, ml: 2 }}>
                  <CopyBlock value={policy.name} />
                </Box>
              </ListItem>

              {index < initialPolicies.length - 1 && <Divider sx={{ my: 3 }} />}
            </React.Fragment>
          );
        })}

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
              10
            </Box>
            <ListItemText
              primary={
                <>
                  Go to the  &nbsp;
                  <Button
                    variant="text"
                    size="small"
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textTransform: "none", p: 0 }}
                  >
                    CK-Tuner-Role
                  </Button>
                </>
              }
            />
          </Box>
          <img src={ob21} alt="" />


        </ListItem>

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
              11
            </Box>
            <Typography>In Permission policies, click on Add permissions {'>'} Attach Policy</Typography>
          </Box>
          <img src={ob22} alt="" />


        </ListItem>
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
              12
            </Box>
            <Typography>Filter by Type {'>'} Customer managed then search for cktuner-CostAuditPolicy, cktuner-SecAuditPolicy, cktuner-TunerReadEssentials and select them.</Typography>
          </Box>
          <img src={ob24} alt="" />


        </ListItem>
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
              13
            </Box>
            <Typography>
              Now, click on Add permissions
            </Typography>
          </Box>
        </ListItem>

        <ListItem sx={{ alignItems: "flex-start", flexDirection: "column" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography fontWeight="bold" ml={0.5} mr={2} mt={0.4} color="primary.main">14</Typography>
            <Typography>In Permission policies, click on Add permissions {'>'} Create inline policy</Typography>
          </Box>
          <img src={ob23} alt="" />


        </ListItem>
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
              15
            </Box>
            <Typography>
              Click on the <code>JSON</code> tab and paste the following policy, then click <strong>Next</strong>:
            </Typography>
          </Box>

          <Box sx={{ width: "97%", ml: 5 }}>
    <JsonViewerWithCopy jsonText={additionalPolicy.json} />
  </Box>
        </ListItem>


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
              16
            </Box>
            <Typography>
              Now, click on <strong>Review policy</strong>
            </Typography>
          </Box>
        </ListItem>

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
              17
            </Box>
            <Typography>
              In the <code>Name</code> field, enter: <strong>S3CrossAccountReplication</strong>
            </Typography>
          </Box>
          <Box sx={{ mt: 1, ml: 2 }}>
            <CopyBlock value={additionalPolicy.name} />
          </Box>
          <Typography ml={6} mt={1}>
            Then click on <strong>Create Policy</strong>
          </Typography>
        </ListItem>
      </List>


    </Box>
  );
};

export default OnboardingPage2;