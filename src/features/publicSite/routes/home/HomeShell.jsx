import Footer from "../../layout/Footer/Footer.jsx";
import Header from "../../layout/Header/Header.jsx";
import AboutGGG from "../../sections/AboutGGG/AboutGGG.jsx";
import Hero from "../../sections/Hero/Hero.jsx";
import WorkTogether from "../../sections/WorkTogether/WorkTogether.jsx";
import FadeIn from "../../shared/FadeIn/FadeIn.jsx";

const dividerClass = "h-px w-full bg-ggg-border";

const HomeShell = ({ children, groupUrl, mediaAssets, siteContent }) => (
  <div className="min-h-screen isolate overflow-x-hidden bg-ggg-bg text-ggg-text font-medium">
    <Header
      brandLogoUrl={mediaAssets.brandLogo.url}
      groupUrl={groupUrl}
      header={siteContent.header}
      site={siteContent.site}
    />
    <main id="main-content">
      <Hero
        hero={siteContent.hero}
        heroKeyArtUrl={mediaAssets.heroKeyArt.url}
      />

      {children}

      <FadeIn>
        <AboutGGG aboutGGG={siteContent.aboutGGG} />
      </FadeIn>
      <div className={dividerClass} role="presentation" aria-hidden />
      <FadeIn>
        <WorkTogether
          contactEmail={siteContent.site.contactEmail}
          pumpkinKeyArtUrl={mediaAssets.contact.pumpkinKeyArt.url}
          workTogether={siteContent.workTogether}
        />
      </FadeIn>
    </main>
    <Footer
      brandLogoUrl={mediaAssets.brandLogo.url}
      footer={siteContent.footer}
      groupUrl={groupUrl}
      media={siteContent.media}
      site={siteContent.site}
    />
  </div>
);

export default HomeShell;
