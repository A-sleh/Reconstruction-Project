import {
  BaseRegistrationValues,
  EngineerFormValues,
  InvestorFormValues,
  ResourceProviderFormValues,
} from "../create-account";

const destructTheUser = (user: BaseRegistrationValues) => {
  const {
    email,
    firstName,
    lastName,
    password,
    photoId,
    personalIdentifier,
    phone,
  } = user;
  return {
    email,
    firstName,
    lastName,
    password,
    photoId,
    personalIdentifier,
    phone,
  };
};

export const providerDTO = (
  provider: BaseRegistrationValues & ResourceProviderFormValues,
) => {
  const { providerRole } = provider;
  const {
    companyAddress,
    location,
    companyName,
    workSiteType,
    licenseOfService,
    logoId,
  } = provider;
  return {
    user: destructTheUser(provider),
    provider: {
      licenseOfService,
      providerRole,
      workSite: {
        name: companyName,
        logoId,
        location,
        address: companyAddress,
        workSiteType: workSiteType,
      },
    },
  };
};

export const investorDTO = (
  investor: BaseRegistrationValues & InvestorFormValues,
) => {
  const { commercialRegistration } = investor;
  return {
    user: destructTheUser(investor),
    investor: {
      commercialRegisterId: commercialRegistration,
    },
  };
};

export const engineerDTO = (
  engineer: BaseRegistrationValues & EngineerFormValues,
) => {
  const { syndicateId } = engineer;
  return {
    user: destructTheUser(engineer),
    engineer: {
      syndicateId: syndicateId,
    },
  };
};
