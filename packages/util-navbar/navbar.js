export const init = () => {
  // Find all dropdown wrappers
  const dropdownWrappers = document.querySelectorAll('[data-hs-nav-dropdown="wrapper"]');
  
  // Global array to track all dropdown instances
  const allDropdowns = [];
  
  // Function to close all dropdowns except the specified one
  const closeAllDropdowns = (exceptWrapper = null) => {
    allDropdowns.forEach(dropdown => {
      if (dropdown.wrapper !== exceptWrapper && dropdown.isOpen) {
        dropdown.closeDropdown();
      }
    });
  };
  
  dropdownWrappers.forEach(wrapper => {
    const animationDuration = 0.3;
    
    // Find elements within this wrapper
    const toggle = wrapper.querySelector('a'); // the toggle link
    const list = wrapper.querySelector('[data-hs-nav-dropdown="list"]');
    const contain = list.querySelector('[data-hs-nav-dropdown="container"]');
    const arrow = toggle.querySelector('[data-hs-nav-dropdown="arrow"]');
    const text = toggle.querySelector('[data-hs-nav-dropdown="text"]'); // find the text element
    
    // Set initial states with GSAP
    gsap.set(contain, { yPercent: -110 });
    gsap.set(list, { display: 'none' });
    gsap.set(arrow, { rotation: 0, scale: 1, x: 0, color: '' });
    gsap.set(text, { scale: 1, color: '' }); // empty string = default color
    
    // Track if dropdown is open
    let isOpen = false;
    let currentTimeline = null;
    
    // Open animation
    function openDropdown() {
      if (isOpen) return;
      
      // Kill any existing timeline
      if (currentTimeline) {
        currentTimeline.kill();
      }
      
      // Close all other dropdowns first
      closeAllDropdowns(wrapper);
      
      isOpen = true;
      
      // Update ARIA states
      toggle.setAttribute('aria-expanded', 'true');
      list.setAttribute('aria-hidden', 'false');
      
      // GSAP animation
      currentTimeline = gsap.timeline();
      currentTimeline.set(list, { display: 'flex' })
        .to(contain, { 
          yPercent: 0, 
          duration: animationDuration, 
          ease: 'ease' 
        }, 0)
        .to(arrow, { 
          rotation: 90,
          scale: 1.2,
          x: 4,
          color: 'var(--swatch--brand)',
          duration: animationDuration, 
          ease: 'ease' 
        }, 0)
        .to(text, {
          scale: 1.1,
          color: 'var(--swatch--brand)',
          duration: animationDuration,
          ease: 'ease'
        }, 0);
    }
    
    // Close animation  
    function closeDropdown() {
      if (!isOpen) return;
      
      // Kill any existing timeline
      if (currentTimeline) {
        currentTimeline.kill();
      }
      
      // Check if focus should be restored to toggle
      const shouldRestoreFocus = list.contains(document.activeElement);
      
      isOpen = false;
      currentMenuItemIndex = -1;
      
      // Update ARIA states
      toggle.setAttribute('aria-expanded', 'false');
      list.setAttribute('aria-hidden', 'true');
      
      // Temporarily remove role="menu" to help screen readers understand menu is closed
      const originalRole = list.getAttribute('role');
      list.removeAttribute('role');
      
      // GSAP animation
      currentTimeline = gsap.timeline();
      currentTimeline.to(contain, { 
          yPercent: -110, 
          duration: animationDuration, 
          ease: 'ease' 
        }, 0)
        .to(arrow, { 
          rotation: 0,
          scale: 1,
          x: 0,
          color: '', // back to default color
          duration: animationDuration, 
          ease: 'ease' 
        }, 0)
        .to(text, {
          scale: 1,
          color: '', // back to default color
          duration: animationDuration,
          ease: 'ease'
        }, 0)
        .set(list, { display: 'none' })
        .call(() => {
          // Restore role after animation completes
          list.setAttribute('role', originalRole || 'menu');
        });
      
      // Restore focus to toggle only if focus was inside dropdown
      if (shouldRestoreFocus) {
        // Small delay to ensure screen reader announces the state change
        setTimeout(() => {
          toggle.focus();
        }, 50);
      }
    }
    
    // Get all menu items for navigation
    const menuItems = list.querySelectorAll('a, button, [role="menuitem"]');
    let currentMenuItemIndex = -1;
    
    // Hover events
    toggle.addEventListener('mouseenter', openDropdown);
    wrapper.addEventListener('mouseleave', closeDropdown);
    
    // Arrow key navigation within dropdown
    list.addEventListener('keydown', function(e) {
      if (!isOpen) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentMenuItemIndex = (currentMenuItemIndex + 1) % menuItems.length;
        menuItems[currentMenuItemIndex].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentMenuItemIndex = currentMenuItemIndex <= 0 ? menuItems.length - 1 : currentMenuItemIndex - 1;
        menuItems[currentMenuItemIndex].focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeDropdown();
        toggle.focus();
      }
    });
    
    // Keyboard events for toggle
    toggle.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        openDropdown();
        // Focus first menu item after opening
        if (menuItems.length > 0) {
          currentMenuItemIndex = 0;
          setTimeout(() => menuItems[0].focus(), 50);
        }
      } else if (e.key === ' ') {
        e.preventDefault();
        // Simple toggle: if closed open, if open close
        if (isOpen) {
          closeDropdown();
        } else {
          openDropdown();
        }
      } else if (e.key === 'ArrowUp' || e.key === 'Escape') {
        e.preventDefault();
        closeDropdown();
      }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!wrapper.contains(e.target) && isOpen) {
        closeDropdown();
      }
    });
    
    // Add this dropdown instance to the global array
    allDropdowns.push({
      wrapper,
      isOpen: () => isOpen,
      closeDropdown
    });
  });
  
  // Global focus management - close dropdown when tab focus moves outside
  document.addEventListener('focusin', function(e) {
    allDropdowns.forEach(dropdown => {
      if (dropdown.isOpen() && !dropdown.wrapper.contains(e.target)) {
        dropdown.closeDropdown();
      }
    });
  });

  return { result: 'navbar initialized' };
};