import { axiosGet, axiosPost, axiosPut } from "@/utils/Shared/axios";

export const fetchIntegrations = async () => {
  const response = await axiosGet("/integration/fetch-integrations", {});
  const results = response.results;
  return JSON.parse(results);
};

export const fetchUserIntegrations = async (integration_name: string) => {
  const response = await axiosGet("/integration/user-integration", {
    integration_name,
  });
  return response.results;
};

export const disconnectUserIntegration = async (integration_id: string) => {
  const response = await axiosPost("/integration/user-integration", {
    integration_id,
  });
  return response.results;
};

export const fetchIntegrationEvents = async (integration_id: string) => {
  const response = await axiosGet(
    "/integration/integration-event/fetch-events",
    {
      integration_id,
    }
  );
  return response.results;
};

export const configureUserIntegration = async (
  id: number,
  configuration: object,
  integration_name: string
) => {
  const response = await axiosPost(
    `/integration/user-integration/${id}?integration_name=${integration_name}`,
    {
      configuration,
    }
  );
  return response;
};

export const integrationOauth = async (payload: object, slug: string) => {
  const response = await axiosPut(`/integration/oauth/${slug}`, payload);
  return response;
};

export const enableIntegrationEvent = async (payload: object) => {
  const response = await axiosPost(
    "/integration/integration-event/enable-event",
    payload
  );
  return response;
};

export const disableIntegrationEvent = async (payload: object) => {
  const response = await axiosPost(
    "/integration/integration-event/disable-event",
    payload
  );
  return response;
};

export const disableNotificationType = async (payload: object) => {
  const response = await axiosPost(
    "/integration/integration-event/disable-such-notifications",
    payload
  );
  return response;
};
