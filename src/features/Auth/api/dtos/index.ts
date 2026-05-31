import {
  BaseRegistrationValues,
  ResourceProviderFormValues,
} from "../create-account";

export const providerDTO = (
  provider: BaseRegistrationValues & ResourceProviderFormValues,
) => {
  const {
    email,
    firstName,
    lastName,
    password,
    photoUrl,
    personalIdentifier,
    phone,
  } = provider;
  const { providerRole } = provider;
  const {
    companyAddress,
    companyLocation,
    companyName,
    workSiteType,
    licenseOfService,
    logoUrl,
  } = provider;
  return {
    user: {
      email,
      phone,
      firstName,
      lastName,
      password,
      photoUrl,
      personalIdentifier,
    },
    provider: {
      licenseOfService,
      providerRole,
      workSite: {
        name: companyName,
        logoUrl: logoUrl,
        location: companyLocation,
        address: companyAddress,
        workSiteType: workSiteType,
      },
    },
  };
};
