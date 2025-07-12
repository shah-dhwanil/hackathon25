from bs4 import BeautifulSoup

def extract_metions(html):
    soup = BeautifulSoup(html, 'html.parser')
    # Find the span with class "mention"
    mention_spans = soup.find_all('span', class_='mention')
    mentions = [span.get_text() for span in mention_spans]
    return mentions

