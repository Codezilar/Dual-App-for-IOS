import Foundation
import SwiftUI

struct AppProfile: Identifiable, Codable, Hashable {
    var id: UUID
    var storageIdentifier: UUID
    var name: String
    var urlString: String
    var colorName: ProfileColor
    var createdAt: Date

    init(
        id: UUID = UUID(),
        storageIdentifier: UUID = UUID(),
        name: String,
        urlString: String,
        colorName: ProfileColor = .teal,
        createdAt: Date = .now
    ) {
        self.id = id
        self.storageIdentifier = storageIdentifier
        self.name = name
        self.urlString = urlString
        self.colorName = colorName
        self.createdAt = createdAt
    }

    var launchURL: URL {
        URL(string: urlString.normalizedWebURL) ?? URL(string: "https://www.google.com")!
    }
}

enum ProfileColor: String, CaseIterable, Codable, Identifiable {
    case teal
    case blue
    case green
    case orange
    case red
    case pink
    case indigo
    case gray

    var id: String { rawValue }

    var color: Color {
        switch self {
        case .teal: .teal
        case .blue: .blue
        case .green: .green
        case .orange: .orange
        case .red: .red
        case .pink: .pink
        case .indigo: .indigo
        case .gray: .gray
        }
    }
}

struct WebAppTemplate: Identifiable, Hashable {
    let id = UUID()
    let name: String
    let urlString: String
    let color: ProfileColor

    static let presets: [WebAppTemplate] = [
        WebAppTemplate(name: "WhatsApp Web", urlString: "https://web.whatsapp.com", color: .green),
        WebAppTemplate(name: "Telegram", urlString: "https://web.telegram.org", color: .blue),
        WebAppTemplate(name: "Gmail", urlString: "https://mail.google.com", color: .red),
        WebAppTemplate(name: "Instagram", urlString: "https://www.instagram.com", color: .pink),
        WebAppTemplate(name: "X", urlString: "https://x.com", color: .gray),
        WebAppTemplate(name: "Facebook", urlString: "https://m.facebook.com", color: .blue),
        WebAppTemplate(name: "LinkedIn", urlString: "https://www.linkedin.com", color: .indigo),
        WebAppTemplate(name: "Custom", urlString: "https://", color: .teal)
    ]
}

extension String {
    var normalizedWebURL: String {
        let trimmed = trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return "https://www.google.com" }
        if trimmed.hasPrefix("http://") || trimmed.hasPrefix("https://") {
            return trimmed
        }
        return "https://" + trimmed
    }
}
