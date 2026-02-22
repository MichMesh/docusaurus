import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HeroBanner() {
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroOverlay}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroMeshtasticBadge}>MESHTASTIC</div>
            <Heading as="h1" className={styles.heroTitle}>
              Michigan Mesh Network
            </Heading>
            <p className={styles.heroTagline}>Connect Your Community</p>
            <p className={styles.heroSubtag}>Free Off-Grid Mesh Network for Everyone</p>
            <div className={styles.heroButtons}>
              <Link className={clsx('button button--lg', styles.btnPrimary)} to="/docs/intro">
                Get Started
              </Link>
              <Link className={clsx('button button--lg', styles.btnSecondary)} to="#host-a-node">
                Host a Node
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function FreeOffGrid() {
  const features = [
    {
      icon: '📻',
      text: 'Uses license-free radio frequencies approved by the FCC \u2014 no ham license or permits needed!',
    },
    {
      icon: '💬',
      text: 'Perfect for texting, weather alerts, GPS tracking, sensor monitoring & more',
    },
    {
      icon: '🏔️',
      text: 'Works without cell towers, Wi-Fi, or internet \u2014 true off-grid communication',
    },
    {
      icon: '🌐',
      text: 'Open-source software built by a global community of volunteers',
    },
    {
      icon: '📡',
      text: 'Uses LoRa (Long Range) radio and mesh networking so messages hop from node to node across miles',
    },
    {
      icon: '💰',
      text: 'Completely free to use \u2014 the only cost is the hardware (~$35 per device)',
    },
  ];

  return (
    <section className={styles.freeOffGrid}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Free Off-Grid Communication
        </Heading>
        <div className={styles.featureGrid}>
          {features.map((f, i) => (
            <div key={i} className={styles.featureItem}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <p className={styles.featureText}>{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhoWeAre() {
  return (
    <section className={styles.whoWeAre}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Who We Are
        </Heading>
        <div className={styles.whoWeAreContent}>
          <p className={styles.leadText}>
            <em>
              We are your neighbors building a community mesh network across the
              area &mdash; powered by volunteers and open-source technology.
            </em>
          </p>
          <p>
            Michigan Mesh connects homes, farms, and businesses using small,
            low-power radio nodes. We are looking for community members with
            tall structures &mdash; barns, silos, rooftops &mdash; who would
            like to help extend the network by hosting a small, unobtrusive
            node. There is no cost or obligation to you!
          </p>
        </div>
      </div>
    </section>
  );
}

function CommunityBenefits() {
  const benefits = [
    {
      icon: '⚡',
      title: 'Emergency Communications',
      description:
        'Send and receive text messages during storms, power outages, or other emergencies when cell service fails',
    },
    {
      icon: '⚙️',
      title: 'Automation & Monitoring',
      description:
        'Monitor equipment, receive intrusion alerts, and automate tasks on your property',
    },
    {
      icon: '🌦️',
      title: 'Weather Monitoring',
      description:
        'Share real-time local weather data from connected sensors across the network',
    },
  ];

  return (
    <section className={styles.communityBenefits}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Community Benefits
        </Heading>
        <p className={styles.sectionSubtitle}>
          A mesh network gives your community powerful tools that work even when
          the power goes out or cell towers go down.
        </p>
        <div className={styles.benefitsGrid}>
          {benefits.map((b, i) => (
            <div key={i} className={styles.benefitCard}>
              <div className={styles.benefitIcon}>{b.icon}</div>
              <Heading as="h3" className={styles.benefitTitle}>
                {b.title}
              </Heading>
              <p>{b.description}</p>
            </div>
          ))}
        </div>
        <div className={styles.noFeesBanner}>
          <span>No Monthly Fees. Ever.</span>
          <br />
          <small>All powered by your community</small>
        </div>
      </div>
    </section>
  );
}

function HostANode() {
  return (
    <section id="host-a-node" className={styles.hostANode}>
      <div className="container">
        <div className={styles.hostGrid}>
          <div className={styles.hostWhy}>
            <Heading as="h2" className={styles.sectionTitle}>
              Why Host a Node on Your Property?
            </Heading>
            <p className={styles.hostSubtitle}>Small Device. Big Impact.</p>
            <p>
              A single node on a tall structure can extend the mesh network for
              miles in every direction, connecting dozens of families to free,
              reliable communication.
            </p>
          </div>
          <div className={styles.hostWhat}>
            <Heading as="h2" className={styles.sectionTitle}>
              What Does Hosting Involve?
            </Heading>
            <p className={styles.hostSubtitle}>Hosting is Easy & Free:</p>
            <ul className={styles.hostList}>
              <li>
                We provide and install the node at no cost to you &mdash; a
                small solar-powered device about the size of a solar garden
                light
              </li>
              <li>
                The node simply relays messages &mdash; it does not access,
                store, or monitor any of your data
              </li>
              <li>
                No internet connection or power outlet needed &mdash; nodes run
                on solar with battery backup
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function FunAndFree() {
  return (
    <section className={styles.funAndFree}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          It's Fun & It's Free!
        </Heading>
        <div className={styles.funContent}>
          <div className={styles.funText}>
            <p>
              Send messages to friends and family miles away &mdash; no cell
              plan needed. Track hikes and outdoor adventures with built-in GPS
              sharing. Experiment with sensors, home automation, and DIY
              electronics. Join a nationwide community of Meshtastic
              enthusiasts.
            </p>
            <p>
              The only cost is the hardware itself &mdash; devices start at
              around <strong>$35</strong>. The network, the software, and the
              community are all completely free.
            </p>
            <p>
              Best of all, Meshtastic operates on FCC-approved, license-free
              frequencies. Anyone can use it &mdash; no amateur radio license,
              no permits, no paperwork. Just turn on your node and start
              connecting!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Resources() {
  return (
    <section className={styles.resources}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Mesh Network Resources
        </Heading>
        <div className={styles.resourceLinks}>
          <a
            href="https://meshtastic.org"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.resourceCard}>
            <span className={styles.resourceIcon}>🌐</span>
            <div>
              <strong>meshtastic.org</strong>
              <p>Official Meshtastic project &mdash; firmware, apps, and documentation</p>
            </div>
          </a>
          <Link to="/docs/intro" className={styles.resourceCard}>
            <span className={styles.resourceIcon}>📖</span>
            <div>
              <strong>MichMesh Docs</strong>
              <p>Local guides, setup help, and Michigan-specific information</p>
            </div>
          </Link>
          <a
            href="https://discord.gg/skgWyPuft8"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.resourceCard}>
            <span className={styles.resourceIcon}>💬</span>
            <div>
              <strong>Join our Discord</strong>
              <p>Connect with the MichMesh community</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      title="Michigan Mesh Network"
      description="Free off-grid mesh network for everyone. Michigan Mesh connects communities using Meshtastic LoRa radio nodes.">
      <HeroBanner />
      <main>
        <FreeOffGrid />
        <WhoWeAre />
        <CommunityBenefits />
        <HostANode />
        <FunAndFree />
        <Resources />
      </main>
    </Layout>
  );
}
