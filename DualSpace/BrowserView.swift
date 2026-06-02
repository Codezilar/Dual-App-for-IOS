import SwiftUI
import WebKit

struct BrowserView: View {
    let profile: AppProfile
    @StateObject private var model: BrowserViewModel
    @State private var addressText: String

    init(profile: AppProfile) {
        self.profile = profile
        _model = StateObject(wrappedValue: BrowserViewModel(profile: profile))
        _addressText = State(initialValue: profile.urlString)
    }

    var body: some View {
        VStack(spacing: 0) {
            progress
            WebView(webView: model.webView)
            toolbar
        }
        .navigationTitle(profile.name)
        .navigationBarTitleDisplayMode(.inline)
        .onReceive(model.$currentURL.compactMap { $0?.absoluteString }) { urlString in
            addressText = urlString
        }
    }

    private var progress: some View {
        ProgressView(value: model.progress)
            .progressViewStyle(.linear)
            .opacity(model.isLoading ? 1 : 0)
    }

    private var toolbar: some View {
        VStack(spacing: 8) {
            HStack(spacing: 8) {
                Button {
                    model.webView.goBack()
                } label: {
                    Image(systemName: "chevron.backward")
                }
                .disabled(!model.canGoBack)

                Button {
                    model.webView.goForward()
                } label: {
                    Image(systemName: "chevron.forward")
                }
                .disabled(!model.canGoForward)

                Button {
                    if model.isLoading {
                        model.webView.stopLoading()
                    } else {
                        model.webView.reload()
                    }
                } label: {
                    Image(systemName: model.isLoading ? "xmark" : "arrow.clockwise")
                }

                TextField("Address", text: $addressText)
                    .textFieldStyle(.roundedBorder)
                    .keyboardType(.URL)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
                    .submitLabel(.go)
                    .onSubmit {
                        model.load(addressText)
                    }

                Button {
                    model.load(addressText)
                } label: {
                    Image(systemName: "arrow.right")
                }
            }
            .buttonStyle(.bordered)
        }
        .padding(10)
        .background(.bar)
    }
}

struct WebView: UIViewRepresentable {
    let webView: WKWebView

    func makeUIView(context: Context) -> WKWebView {
        webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}
}

@MainActor
final class BrowserViewModel: NSObject, ObservableObject, WKNavigationDelegate {
    let webView: WKWebView

    @Published var canGoBack = false
    @Published var canGoForward = false
    @Published var isLoading = false
    @Published var progress = 0.0
    @Published var currentURL: URL?

    private var observations: [NSKeyValueObservation] = []

    init(profile: AppProfile) {
        let configuration = WKWebViewConfiguration()
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true
        configuration.websiteDataStore = WKWebsiteDataStore(forIdentifier: profile.storageIdentifier)

        webView = WKWebView(frame: .zero, configuration: configuration)
        webView.allowsBackForwardNavigationGestures = true

        super.init()

        webView.navigationDelegate = self
        observeWebView()
        load(profile.urlString)
    }

    func load(_ urlString: String) {
        guard let url = URL(string: urlString.normalizedWebURL) else { return }
        webView.load(URLRequest(url: url))
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        syncState()
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        syncState()
    }

    private func observeWebView() {
        observations = [
            webView.observe(\.canGoBack, options: [.initial, .new]) { [weak self] webView, _ in
                Task { @MainActor in self?.canGoBack = webView.canGoBack }
            },
            webView.observe(\.canGoForward, options: [.initial, .new]) { [weak self] webView, _ in
                Task { @MainActor in self?.canGoForward = webView.canGoForward }
            },
            webView.observe(\.isLoading, options: [.initial, .new]) { [weak self] webView, _ in
                Task { @MainActor in self?.isLoading = webView.isLoading }
            },
            webView.observe(\.estimatedProgress, options: [.initial, .new]) { [weak self] webView, _ in
                Task { @MainActor in self?.progress = webView.estimatedProgress }
            },
            webView.observe(\.url, options: [.initial, .new]) { [weak self] webView, _ in
                Task { @MainActor in self?.currentURL = webView.url }
            }
        ]
    }

    private func syncState() {
        canGoBack = webView.canGoBack
        canGoForward = webView.canGoForward
        isLoading = webView.isLoading
        progress = webView.estimatedProgress
        currentURL = webView.url
    }
}

#Preview {
    NavigationStack {
        BrowserView(profile: AppProfile(name: "Preview", urlString: "https://www.apple.com"))
    }
}
