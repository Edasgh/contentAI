import { getTemporaryAccessToken } from "@/actions/getTemporaryAccessToken";
import SchematicEmbed from "./SchematicEmbed";


export default async function SchematicComponent({
  componentId,
}: {

  componentId: string;
}) {

    if(!componentId) return null;

    const accessToken = await getTemporaryAccessToken();

    if(!accessToken) throw new Error("Failed to get access token!");


  return <SchematicEmbed accessToken={accessToken} componentId={componentId} />;
}