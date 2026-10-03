import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS } from '../theme';

const { width } = Dimensions.get('window');

export default function AdBanner() {
  const adHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          background: transparent; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          min-height: 70px;
          overflow: hidden;
          font-family: -apple-system, sans-serif;
        }
        iframe { border: none; max-width: 100%; }
      </style>
    </head>
    <body>
      <script type="text/javascript">
        atOptions = {
          'key' : '29ec1833cfe61d8cf747a796eb44a3fd',
          'format' : 'iframe',
          'height' : 60,
          'width' : 468,
          'params' : {}
        };
      </script>
      <script type="text/javascript" src="https://www.highperformanceformat.com/29ec1833cfe61d8cf747a796eb44a3fd/invoke.js"></script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: adHtml }}
        style={styles.webview}
        scrollEnabled={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
        mixedContentMode="always"
        androidLayerType="hardware"
        cacheEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 75,
    backgroundColor: COLORS.bg,
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
  },
});
