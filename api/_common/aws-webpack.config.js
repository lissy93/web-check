const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    target: 'node',
    mode: 'production',
    entry: {
        'carbon': './api/carbon.js',
        'cookies': './api/cookies.js',
        'dns-server': './api/dns-server.js',
        'dns': './api/dns.js',
        'dnssec': './api/dnssec.js',
        'features': './api/features.js',
        'get-ip': './api/get-ip.js',
        'headers': './api/headers.js',
        'hsts': './api/hsts.js',
        'linked-pages': './api/linked-pages.js',
        'mail-config': './api/mail-config.js',
        'ports': './api/ports.js',
        'quality': './api/quality.js',
        'redirects': './api/redirects.js',
        'robots-txt': './api/robots-txt.js',
        'screenshot': './api/screenshot.js',
        'security-txt': './api/security-txt.js',
        'sitemap': './api/sitemap.js',
        'social-tags': './api/social-tags.js',
        'ssl': './api/ssl.js',
        'status': './api/status.js',
        'tech-stack': './api/tech-stack.js',
        'trace-route': './api/trace-route.js',
        'txt-records': './api/txt-records.js',
        'whois': './api/whois.js',
    },
    externals: [nodeExternals()],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '.webpack'),
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: /node_modules/,
            }
        ]
    }
};
