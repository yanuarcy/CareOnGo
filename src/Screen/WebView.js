import { useRoute } from "@react-navigation/native";
import { Spinner } from "native-base";
import { WebView } from "react-native-webview";

const Webview = () => {
    const route = useRoute();
    const initialLink = route.params ? route.params.link : "";

    return (
      <>
        {/* <Header title={"Read"} withBack={true} /> */}
        <WebView
          source={{ uri: initialLink }}
          startInLoadingState={true}
          renderLoading={() => <Spinner size={"lg"} color={"black"} />}
        />
      </>
    );
  };
  
  export default Webview;