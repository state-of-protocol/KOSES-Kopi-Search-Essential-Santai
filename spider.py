import os
import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import subprocess
import time
import random

class KosesEngine:
    def __init__(self):
        self.targets_file = 'targets.txt'
        self.output_dir = 'data'
        self.latest_file = os.path.join(self.output_dir, 'web_index_latest.json')
        
        # Blacklist dikecilkan supaya tak kacau URL utama anda
        self.blacklist = ['doubleclick', 'analytics', 'ads', 'pixel']
        
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)

    def get_targets(self):
        targets = []
        if os.path.exists(self.targets_file):
            with open(self.targets_file, 'r', encoding='utf-8') as f:
                for line in f:
                    # Abaikan komen atau baris kosong
                    if '|' in line and not line.strip().startswith('#'):
                        try:
                            url, lang = line.split('|')
                            targets.append({'url': url.strip(), 'lang': lang.strip()})
                        except ValueError:
                            continue
        return targets

    def crawl(self):
        print("="*65)
        print(f" KOSES AUTOMATED ARCHIVER v3.5 [DATE: {datetime.now().strftime('%d_%m_%Y')}]")
        print("="*65)
        
        results = []
        targets = self.get_targets()
        
        if not targets:
            print(" [!] ERROR: targets.txt kosong atau format salah!")
            return

        for target in targets:
            url = target['url']
            lang = target['lang']
            
            try:
                print(f" [>] [{lang}] INITIATING: {url}")
                
                # Headers untuk kurangkan risiko kena block (403 Forbidden)
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
                }
                
                response = requests.get(url, headers=headers, timeout=15)
                
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    title_tag = soup.title.string if soup.title else "UNTITLED_NODE"
                    
                    results.append({
                        'title': title_tag.strip(),
                        'url': url,
                        'lang': lang,
                        'timestamp': datetime.now().isoformat()
                    })
                    print(f" [+] [{lang}] SYNC_SUCCESS: {title_tag.strip()[:30]}...")
                else:
                    print(f" [!] [{lang}] ERROR {response.status_code}: Site restricted.")
                
                # Jeda 5-10 saat supaya IP anda tak kena ban
                time.sleep(random.uniform(5, 10))

            except Exception as e:
                print(f" [!] [{lang}] FAILED: {str(e)[:50]}")

        self.save_data(results)
        
    def save_data(self, data):
        # Simpan Arkib Harian
        today_str = datetime.now().strftime('%d_%m_%Y')
        today_folder = os.path.join(self.output_dir, today_str)
        if not os.path.exists(today_folder):
            os.makedirs(today_folder)
            
        archive_name = os.path.join(today_folder, f"web_index_{datetime.now().strftime('%I.%M_%p')}.json")
        
        with open(archive_name, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)
            
        # Simpan Fail Latest (Untuk Website)
        with open(self.latest_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)
            
        print(f"\n [!] ARCHIVE_COMPLETE. TOTAL_NODES_SAVED: {len(data)}")
        self.auto_push()

    def auto_push(self):
        print("-" * 30)
        print(" [>] INITIATING_GIT_PUSH_PROTOCOL...")
        try:
            # 1. Add SEMUA (Skrip + Data + HTML/CSS anda)
            subprocess.run(['git', 'add', '.'], check=True)
            
            # 2. Commit dengan timestamp
            commit_msg = f"KOSES_AUTO_CRAWL: {datetime.now().strftime('%d-%m-%Y %I:%M %p')}"
            subprocess.run(['git', 'commit', '-m', commit_msg], check=True)
            
            # 3. Push Biasa (Bukan Force - Supaya Selamat)
            subprocess.run(['git', 'push', 'origin', 'main'], check=True)
            
            print(" [+] GITHUB_SYNC_COMPLETE: Everything is up to date.")
        except Exception as e:
            print(f" [!] GIT_SYNC_FAILED: Sila pastikan tiada konflik fail.")
        print("-" * 30)

if __name__ == "__main__":
    engine = KosesEngine()
    engine.crawl()