// Imports
import React, { useState, useEffect} from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Local imports
import CancelButton from "../components/CancelButton";
import CopyBlock from "../components/CopyBlock";
import JsonViewerWithCopy from "../components/JsonViewerWithCopy";
import OnboardingPage2 from "./OnboardingPage2";
import OnboardingPage3 from "./OnboardingPage3";
import arnimg from "../assets/arnimg.png";

// Redux
import {
  updateFormField,
  submitOnboardingData,
  resetForm,
} from "../redux/slices/onboardingSlice";
import { iamTrustPolicy } from "../components/policySnippets";

// Step button text config
const stepLabels = {
  1: { next: "Next - Add Customer Managed Policies", back: "Back" },
  2: { next: "Next - Create CUR", back: "Back - Create An IAM Role" },
  3: { next: "Submit", back: "Back - Create CUR" },
};

// Component
const OnboardingPage1 = () => {


  // State
  const [step, setStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});
 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formConfig = useSelector((state) => state.onboarding.formConfig || {});
  const status = useSelector((state) => state.onboarding.status);
  const error = useSelector((state) => state.onboarding.error);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormField({ field: name, value }));
    setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
  };


  const handleNext = () => {
    if (step === 1 && !validateFormFields()) return;

    if (step === 3) {
      dispatch(submitOnboardingData(formConfig));
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      navigate("/onboarding");
      dispatch(resetForm());
    } else {
      setStep((prev) => prev - 1);
    }
  };

  // Effects
  useEffect(() => {
    if (status === "succeeded") {
      console.log("✅ Account created successfully!");
      navigate('/onboarding/thankyou');
    } else if (status === "failed") {
      console.error("❌ Failed to create account:", error);
      alert("Error: " + error);
    }
  }, [status, error]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // Validation
  const validateFormFields = () => {
    const errors = {};
    const { arn, accountNumber, accountName, region } = formConfig;

    const arnRegex = /^arn:aws:iam::\d{12}:role\/[\w+=,.@-]{1,64}$/;
    const accountNumberRegex = /^\d{12}$/;
    const regionRegex = /^[a-z]{2}-[a-z]+-\d{1}$/;

    if (!arn?.trim()) errors.arn = "IAM Role ARN is required";
    else if (!arnRegex.test(arn)) errors.arn = "IAM Role ARN format is invalid";

    if (!accountNumber?.trim()) errors.accountNumber = "AWS Account ID is required";
    else if (!accountNumberRegex.test(accountNumber)) errors.accountNumber = "Account ID must be exactly 12 digits";

    if (!accountName?.trim()) errors.accountName = "Account name is required";

    if (!region?.trim()) errors.region = "AWS Region is required";
    else if (!regionRegex.test(region)) errors.region = "Region must follow format (e.g. us-east-1)";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step Rendering
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Box sx={{ Width: 900, margin: "auto", p: 3, bgcolor: "#f9fafb", borderRadius: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Create an IAM Role
            </Typography>
            <Typography mb={3}>Create an IAM Role by following these steps</Typography>

            <List disablePadding>
              {[
                {
                  label: "Log into AWS account",
                  content: (
                    <>
                      Log into AWS account &nbsp;
                      <Button
                        variant="text"
                        size="small"
                        href="https://console.aws.amazon.com/iam/home#/roles"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ textTransform: "none", p: 0 }}
                      >
                        Create an IAM Role.
                      </Button>
                    </>
                  ),
                },
                {
                  label: "Trusted entity",
                  content: (
                    <>
                      In the <code>Trusted entity type</code> section, select <strong>Custom trust policy</strong>. Replace with:
                      <JsonViewerWithCopy jsonText={iamTrustPolicy} />
                    </>
                  ),
                },
                {
                  label: "Permissions",
                  content: (
                    <>
                      Click <code>Next</code> to proceed without adding permissions for now. Permissions will be based on the AWS Account ID later.
                    </>
                  ),
                },
                {
                  label: "Role name",
                  content: (
                    <>
                      Use this role name:
                      <Box sx={{ mt: 1,ml:-3}}>
                        <CopyBlock value="CK-Tuner-Role-dev2" />
                      </Box>
                    </>
                  ),
                },
              ].map((item, index) => (
                <ListItem key={index} sx={{ alignItems: "flex-start" }}>
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
                    {index + 1}
                  </Box>
                  <ListItemText primary={item.content} />
                </ListItem>
              ))}

              {/* Step 5 - ARN Image */}
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
                  <Typography>Go to the newly created IAM Role and copy the Role ARN -</Typography>
                </Box>
                <img src={arnimg} alt="ARN example" />
              </ListItem>

              {/* Step 6 - ARN Input */}
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
                  6
                </Box>  
                <ListItemText
                  primary={
                    <>
                      <Typography>Paste the copied Role ARN below:</Typography>
                      <TextField
                        name="arn"
                        fullWidth
                        label={
                          <>
                            IAM Role ARN <Box component="span" color="error.main">*</Box>
                          </>
                        }
                        placeholder="e.g. arn:aws:iam::123456789012:role/CK-Tuner-Role-dev2"
                        variant="outlined"
                        value={formConfig.arn}
                        onChange={handleChange}
                        error={!!validationErrors.arn}
                        helperText={validationErrors.arn}
                        sx={{ mt: 2 }}
                      />
                    </>
                  }
                />
              </ListItem>

              {/* Step 7 - AWS Account Info */}
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
                    7
                  </Box>
                  <Typography>Enter your AWS Account ID, Account Name and AWS Region:</Typography>
                </Box>

                <Box sx={{ width: "97.5%", display: "flex", flexDirection: "column", gap: 2, ml: 5 }}>
                  <TextField
                    name="accountNumber"
                    fullWidth
                    label={<>AWS Account ID (12 digits) <Box component="span" color="error.main">*</Box></>}
                    placeholder="e.g. 123456789012"
                    variant="outlined"
                    value={formConfig.accountNumber}
                    onChange={handleChange}
                    error={!!validationErrors.accountNumber}
                    helperText={validationErrors.accountNumber}
                    inputProps={{ maxLength: 12, inputMode: "numeric", pattern: "[0-9]*" }}
                    
                  />
                  <TextField
                    name="accountName"
                    fullWidth
                    label={<>AWS Account Name <Box component="span" color="error.main">*</Box></>}
                    placeholder="e.g. DevOps Sandbox"
                    variant="outlined"
                    value={formConfig.accountName}
                    onChange={handleChange}
                    error={!!validationErrors.accountName}
                    helperText={validationErrors.accountName}
                    
                  />
                  <TextField
                    name="region"
                    fullWidth
                    label={<>AWS Region <Box component="span" color="error.main">*</Box></>}
                    placeholder="e.g. us-east-1"
                    variant="outlined"
                    value={formConfig.region}
                    onChange={handleChange}
                    error={!!validationErrors.region}
                    helperText={validationErrors.region}
                   
                  />
                </Box>
              </ListItem>
            </List>

           
          </Box>
        );

      case 2:
        return <OnboardingPage2 />;
      case 3:
        return <OnboardingPage3 />;
      default:
        return null;
    }
  };

  // Render
  return (
    <Box sx={{ width: "100%", py: 1 }}>
      {renderStepContent()}
      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          gap: 2,
          textAlign: "center",
        }}
      >
        <CancelButton />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" onClick={handleBack}>
            {stepLabels[step]?.back}
          </Button>
          <Button variant="contained" onClick={handleNext}>
            {stepLabels[step]?.next}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default OnboardingPage1;
