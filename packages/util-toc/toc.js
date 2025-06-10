export async function init() {
    const contentArea = document.querySelector('[data-hs-toc="content"]');
    const tocList = document.querySelector('[data-hs-toc="list"]');

    // Check main elements
    if (!contentArea) { return; }
    if (!tocList) { return; }
    if (tocList.children.length === 0) { return; }

    const template = tocList.children[0];
    tocList.innerHTML = '';
    const h2Headings = contentArea.querySelectorAll('h2');

    // Create sections and wrap content
    h2Headings.forEach((heading, index) => {
        const sectionId = heading.textContent.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        const section = document.createElement('div');
        section.id = sectionId;
        heading.parentNode.insertBefore(section, heading);
        section.appendChild(heading);
        let nextElement = section.nextElementSibling;
        while (nextElement && nextElement.tagName !== 'H2') {
            const elementToMove = nextElement;
            nextElement = nextElement.nextElementSibling;
            section.appendChild(elementToMove);
        }
    });

    // Create TOC entries
    h2Headings.forEach((heading, index) => {
        const tocItem = template.cloneNode(true);
        const link = tocItem.querySelector('a');
        const sectionId = heading.parentElement.id;
        link.href = '#' + sectionId;

        // Bold numbered text
        const number = document.createElement('strong');
        number.textContent = (index + 1) + '. ';

        // Clear the link and add the number + text
        link.innerHTML = '';
        link.appendChild(number);
        link.appendChild(document.createTextNode(heading.textContent));

        // Add click handler for smooth scrolling
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                // Focus on the section for accessibility (will only show outline for keyboard users due to CSS)
                setTimeout(() => {
                    targetSection.focus();
                }, 100);
            }
        });
        
        // Ensure sections are focusable for keyboard users but use CSS to control focus visibility
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.setAttribute('tabindex', '-1');
            // Use focus-visible to only show outline for keyboard focus
            targetSection.style.outline = 'none';
            targetSection.style.setProperty('outline', 'none', 'important');
        }

        // Add item to the TOC list
        tocList.appendChild(tocItem);
    });

    return {
        result: 'util-toc initialized'
    };
}