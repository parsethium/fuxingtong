// Hash navigation - scroll to target and reveal page
(function () {
    if (window.location.hash) {
        window.addEventListener('DOMContentLoaded', function () {
            const target = document.querySelector(window.location.hash);
            if (target) {
                // Scroll immediately without animation
                target.scrollIntoView();
            }
            // Show page after scroll (page was hidden by inline script in head)
            document.documentElement.style.opacity = '1';
        });
    }
})();

// Mobile Navigation Menu
document.addEventListener('DOMContentLoaded', function () {
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const closeBtn = document.querySelector('.mobile-nav-close');
    const mobileDropdowns = document.querySelectorAll('.mobile-nav-dropdown');

    // Smart Header - Hide on scroll down, show on scroll up
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const currentScrollY = window.scrollY;

        // Only hide header after scrolling past the header height
        if (currentScrollY > 100) {
            if (currentScrollY > lastScrollY) {
                // Scrolling down - hide header
                header.classList.add('header-hidden');
            } else {
                // Scrolling up - show header
                header.classList.remove('header-hidden');
            }
        } else {
            // At the top of the page - always show header
            header.classList.remove('header-hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    function closeMobileMenu() {
        if (mobileOverlay) {
            mobileOverlay.classList.remove('active');
            document.body.classList.remove('mobile-menu-active');
            document.body.style.overflow = '';

            // Close all dropdowns when menu closes
            mobileDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
                const toggleBtn = dropdown.querySelector('.mobile-nav-link-wrapper');
                if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
            });
        }
    }

    // Open mobile menu
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function () {
            mobileOverlay.classList.add('active');
            document.body.classList.add('mobile-menu-active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close mobile menu and reset dropdowns
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking any actual link (not toggles)
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // If it's a dropdown toggle link, ignore (handled below)
            if (this.closest('.mobile-nav-link-wrapper')) return;

            closeMobileMenu();
        });
    });

    // Mobile dropdown toggle with rotating arrow - allow multiple open
    mobileDropdowns.forEach(dropdown => {
        const linkWrapper = dropdown.querySelector('.mobile-nav-link-wrapper');
        const mainLink = dropdown.querySelector('.mobile-nav-link');

        if (linkWrapper) {
            linkWrapper.setAttribute('role', 'button');
            linkWrapper.setAttribute('aria-expanded', 'false');

            linkWrapper.addEventListener('click', function (e) {
                // Prevent navigation
                e.preventDefault();

                // Simply toggle current dropdown - don't close others
                const isActive = dropdown.classList.toggle('active');
                linkWrapper.setAttribute('aria-expanded', isActive);
            });
        }

        // Prevent main link from navigating
        if (mainLink) {
            mainLink.addEventListener('click', function (e) {
                e.preventDefault();
            });
        }
    });

    // Desktop Dropdown menu functionality
    const dropdownItems = document.querySelectorAll('.nav-item-dropdown');

    dropdownItems.forEach(item => {
        const navLink = item.querySelector('.nav-link');
        const dropdownMenu = item.querySelector('.dropdown-menu');

        // Prevent default click behavior on dropdown links
        navLink.addEventListener('click', function (e) {
            e.preventDefault();
        });

        // Show dropdown on hover
        item.addEventListener('mouseenter', function () {
            dropdownMenu.style.opacity = '1';
            dropdownMenu.style.visibility = 'visible';
        });

        // Hide dropdown on mouse leave
        item.addEventListener('mouseleave', function () {
            dropdownMenu.style.opacity = '0';
            dropdownMenu.style.visibility = 'hidden';
        });
    });

    // Hero Image Slideshow
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 0) {
        let currentSlide = 0;

        function showNextSlide() {
            // Remove active class from current slide
            heroSlides[currentSlide].classList.remove('active');

            // Move to next slide
            currentSlide = (currentSlide + 1) % heroSlides.length;

            // Add active class to new slide
            heroSlides[currentSlide].classList.add('active');
        }

        // Change slide every 2 seconds
        setInterval(showNextSlide, 4000);
    }

    // Forging Page - Explore More Button
    const forgingExploreBtn = document.getElementById('forging-explore-btn');
    if (forgingExploreBtn) {
        forgingExploreBtn.addEventListener('click', function () {
            const fabricationSection = document.getElementById('forging-fabrication-steps');
            const sampleProductsSection = document.getElementById('forging-sample-products');

            // Reveal the sections
            if (fabricationSection) {
                fabricationSection.classList.add('revealed');
            }
            if (sampleProductsSection) {
                sampleProductsSection.classList.add('revealed');
            }

            // Hide the explore button after clicking
            forgingExploreBtn.style.display = 'none';

            // Smooth scroll to the revealed content
            setTimeout(() => {
                if (fabricationSection) {
                    fabricationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        });
    }

    // Casting Page - Explore More Button
    const castingExploreBtn = document.getElementById('casting-explore-btn');
    if (castingExploreBtn) {
        castingExploreBtn.addEventListener('click', function () {
            const processSection = document.getElementById('casting-process-section');
            const powderSection = document.getElementById('casting-powder-section');
            const sampleProductsSection = document.getElementById('casting-sample-products');

            // Reveal the sections
            if (processSection) {
                processSection.classList.add('revealed');
            }
            if (powderSection) {
                powderSection.classList.add('revealed');
            }
            if (sampleProductsSection) {
                sampleProductsSection.classList.add('revealed');
            }

            // Hide the explore button after clicking
            castingExploreBtn.style.display = 'none';

            // Smooth scroll to the revealed content
            setTimeout(() => {
                if (processSection) {
                    processSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        });
    }

    // Machining Page - Explore More Button
    const machiningExploreBtn = document.getElementById('machining-explore-btn');
    if (machiningExploreBtn) {
        machiningExploreBtn.addEventListener('click', function () {
            const sampleProductsSection = document.getElementById('machining-sample-products');

            // Reveal the section
            if (sampleProductsSection) {
                sampleProductsSection.classList.add('revealed');
            }

            // Hide the explore button after clicking
            machiningExploreBtn.style.display = 'none';

            // Smooth scroll to the revealed content
            setTimeout(() => {
                if (sampleProductsSection) {
                    sampleProductsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        });
    }

    // Forming Page - Explore More Button
    const formingExploreBtn = document.getElementById('forming-explore-btn');
    if (formingExploreBtn) {
        formingExploreBtn.addEventListener('click', function () {
            const fabricationSection = document.getElementById('forming-fabrication-steps');
            const sampleProductsSection = document.getElementById('forming-sample-products');

            // Reveal the sections
            if (fabricationSection) {
                fabricationSection.classList.add('revealed');
            }
            if (sampleProductsSection) {
                sampleProductsSection.classList.add('revealed');
            }

            // Hide the explore button after clicking
            formingExploreBtn.style.display = 'none';

            // Smooth scroll to the revealed content
            setTimeout(() => {
                if (fabricationSection) {
                    fabricationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        });
    }

    // Additive Manufacturing Page - Explore More Button
    const additiveExploreBtn = document.getElementById('additive-explore-btn');
    if (additiveExploreBtn) {
        additiveExploreBtn.addEventListener('click', function () {
            const processSection = document.getElementById('additive-process-steps');
            const sampleProductsSection = document.getElementById('additive-sample-products');

            // Reveal the sections
            if (processSection) {
                processSection.classList.add('revealed');
            }
            if (sampleProductsSection) {
                sampleProductsSection.classList.add('revealed');
            }

            // Hide the explore button after clicking
            additiveExploreBtn.style.display = 'none';

            // Smooth scroll to the revealed content
            setTimeout(() => {
                if (processSection) {
                    processSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        });
    }

    // Inspection Page - Explore More Button
    const inspectionExploreBtn = document.getElementById('inspection-explore-btn');
    if (inspectionExploreBtn) {
        inspectionExploreBtn.addEventListener('click', function () {
            const sampleProductsSection = document.getElementById('inspection-sample-products');

            // Reveal the section
            if (sampleProductsSection) {
                sampleProductsSection.classList.add('revealed');
            }

            // Hide the explore button after clicking
            inspectionExploreBtn.style.display = 'none';

            // Smooth scroll to the revealed content
            setTimeout(() => {
                if (sampleProductsSection) {
                    sampleProductsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        });
    }

    // Partners Carousel Dot Navigation
    const partnersDots = document.querySelectorAll('.partners-dot');
    const partnersPages = document.querySelectorAll('.partners-page');
    const partnersSection = document.querySelector('.partners-section');

    if (partnersDots.length > 0 && partnersPages.length > 0 && partnersSection) {
        let currentPartnerPage = 0;
        let partnersAutoRotate = null;
        let hasStartedRotation = false;

        function showPartnersPage(pageIndex) {
            // Remove active from all pages and dots
            partnersPages.forEach(page => page.classList.remove('active'));
            partnersDots.forEach(dot => dot.classList.remove('active'));

            // Add active to the selected page and dot
            partnersPages[pageIndex].classList.add('active');
            partnersDots[pageIndex].classList.add('active');
            currentPartnerPage = pageIndex;
        }

        function nextPartnersPage() {
            const nextPage = (currentPartnerPage + 1) % partnersPages.length;
            showPartnersPage(nextPage);
        }

        function startAutoRotation() {
            if (!partnersAutoRotate) {
                partnersAutoRotate = setInterval(nextPartnersPage, 5000);
            }
        }

        function stopAutoRotation() {
            if (partnersAutoRotate) {
                clearInterval(partnersAutoRotate);
                partnersAutoRotate = null;
            }
        }

        // Click handler for dots
        partnersDots.forEach(dot => {
            dot.addEventListener('click', function () {
                const pageIndex = parseInt(this.getAttribute('data-page'));
                showPartnersPage(pageIndex);

                // Reset auto-rotation timer on user interaction
                stopAutoRotation();
                startAutoRotation();
            });
        });

        // Use IntersectionObserver to start auto-rotation when section is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasStartedRotation) {
                    hasStartedRotation = true;
                    startAutoRotation();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(partnersSection);

        // Overflow detection - enable wrapping when logos start getting clipped
        function checkPartnersOverflow() {
            const activePage = document.querySelector('.partners-page.active');
            if (!activePage) return;

            const carousel = document.querySelector('.partners-carousel');
            if (!carousel) return;

            // Temporarily remove wrap class to measure natural overflow
            activePage.classList.remove('allow-wrap');

            // Get the container width and the content scroll width
            const containerWidth = activePage.clientWidth;
            const scrollWidth = activePage.scrollWidth;

            // If content overflows (even slightly), enable wrapping
            if (scrollWidth > containerWidth + 10) {
                partnersPages.forEach(page => page.classList.add('allow-wrap'));
            } else {
                partnersPages.forEach(page => page.classList.remove('allow-wrap'));
            }
        }

        // Check overflow on load and resize
        checkPartnersOverflow();
        window.addEventListener('resize', checkPartnersOverflow);

        // Also check when page changes
        const originalShowPartnersPage = showPartnersPage;
        showPartnersPage = function (pageIndex) {
            originalShowPartnersPage(pageIndex);
            setTimeout(checkPartnersOverflow, 50);
        };
    }
});
