import Foundation
import SwiftUI
import WebKit

@MainActor
final class ProfileStore: ObservableObject {
    @Published private(set) var profiles: [AppProfile] = [] {
        didSet { save() }
    }

    private let storageURL: URL

    init() {
        let documents = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        storageURL = documents.appendingPathComponent("profiles.json")
        load()
    }

    func add(_ profile: AppProfile) {
        profiles.insert(profile, at: 0)
    }

    func update(_ profile: AppProfile) {
        guard let index = profiles.firstIndex(where: { $0.id == profile.id }) else { return }
        profiles[index] = profile
    }

    func delete(at offsets: IndexSet) {
        let removed = offsets.map { profiles[$0] }
        profiles.remove(atOffsets: offsets)
        for profile in removed {
            clearData(for: profile)
        }
    }

    func clearData(for profile: AppProfile) {
        WKWebsiteDataStore.remove(forIdentifier: profile.storageIdentifier) { error in
            if let error {
                print("Failed to clear data for \(profile.name): \(error.localizedDescription)")
            }
        }
    }

    private func load() {
        guard FileManager.default.fileExists(atPath: storageURL.path) else {
            profiles = [
                AppProfile(name: "WhatsApp Main", urlString: "https://web.whatsapp.com", colorName: .green),
                AppProfile(name: "Gmail Work", urlString: "https://mail.google.com", colorName: .red)
            ]
            return
        }

        do {
            let data = try Data(contentsOf: storageURL)
            profiles = try JSONDecoder().decode([AppProfile].self, from: data)
        } catch {
            profiles = []
            print("Failed to load profiles: \(error.localizedDescription)")
        }
    }

    private func save() {
        do {
            let data = try JSONEncoder().encode(profiles)
            try data.write(to: storageURL, options: .atomic)
        } catch {
            print("Failed to save profiles: \(error.localizedDescription)")
        }
    }
}
