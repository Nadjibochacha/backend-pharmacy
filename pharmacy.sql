-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 22, 2024 at 08:29 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pharmacy`
--

-- --------------------------------------------------------

--
-- Table structure for table `carte_chifa`
--

CREATE TABLE `carte_chifa` (
  `id_cart` int(11) NOT NULL,
  `num_suc_soc` varchar(30) NOT NULL,
  `pous_suc` int(11) NOT NULL,
  `type_suc` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carte_chifa`
--

INSERT INTO `carte_chifa` (`id_cart`, `num_suc_soc`, `pous_suc`, `type_suc`) VALUES
(1, '2147483647', 80, 'chronic'),
(6, '202539059565', 80, 'chronic');

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

CREATE TABLE `client` (
  `id_C` int(11) NOT NULL,
  `nom` varchar(40) NOT NULL,
  `address_c` varchar(50) NOT NULL,
  `num_tel` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client`
--

INSERT INTO `client` (`id_C`, `nom`, `address_c`, `num_tel`) VALUES
(13, 'ali', 'alia', 676543457),
(17, 'hamid', 'touggourt', 6543322),
(18, 'baset hala', 'Adrar', 654342367),
(19, 'Alaa bouhemhem', 'ain-mlila', 634322354);

-- --------------------------------------------------------

--
-- Table structure for table `commande_achat`
--

CREATE TABLE `commande_achat` (
  `id_cmd` int(11) NOT NULL,
  `date_cmd` varchar(15) NOT NULL,
  `mode_pay` varchar(10) NOT NULL,
  `status` varchar(15) NOT NULL,
  `produit` varchar(50) NOT NULL,
  `qte` int(11) NOT NULL,
  `id_four` int(11) NOT NULL,
  `num_cmd` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `commande_achat`
--

INSERT INTO `commande_achat` (`id_cmd`, `date_cmd`, `mode_pay`, `status`, `produit`, `qte`, `id_four`, `num_cmd`) VALUES
(6, 'Wed May 15 2024', 'online', 'confirmed', 'heloo', 2, 42, 37646),
(7, 'Wed May 15 2024', 'online', 'confirmed', 'med1', 4, 42, 37646),
(8, 'Wed May 15 2024', 'online', 'confirmed', 'parasitamol', 1, 42, 37646);

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `comment` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`id`, `name`, `comment`) VALUES
(1, 'hamid', 'it\'s good'),
(2, 'hamid', 'it\'s good'),
(3, 'Abderrahmane bamekki', 'thank you for this services'),
(4, 'baset hala  ', 'the delivering is the faster on world ');

-- --------------------------------------------------------

--
-- Table structure for table `facture`
--

CREATE TABLE `facture` (
  `id_fac` int(11) NOT NULL,
  `id_stock` int(11) NOT NULL,
  `num_fac` varchar(30) NOT NULL,
  `qte` int(11) NOT NULL,
  `date` varchar(15) DEFAULT NULL,
  `prix` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facture`
--

INSERT INTO `facture` (`id_fac`, `id_stock`, `num_fac`, `qte`, `date`, `prix`) VALUES
(13, 6, '2147483647', 1, 'Wed May 15 2024', 350),
(20, 5, '33242', 2, 'Wed May 15 2024', 300),
(21, 5, '36856', 1, 'Wed May 15 2024', 150),
(22, 6, '36856', 3, 'Wed May 15 2024', 1050),
(23, 5, '62344', 12, 'Sat May 18 2024', 1800),
(24, 6, '62344', 1, 'Sat May 18 2024', 350),
(25, 5, '6824', 3, 'Sat May 18 2024', 450),
(26, 6, '6824', 1, 'Sat May 18 2024', 350),
(27, 6, '15348', 2, 'Mon May 20 2024', 700),
(28, 5, '15348', 3, 'Mon May 20 2024', 450),
(29, 5, '22779', 1, 'Tue May 21 2024', 150),
(30, 4, '31371', 3, 'Wed May 22 2024', 600),
(31, 5, '31371', 1, 'Wed May 22 2024', 150),
(32, 5, '36720', 3, 'Wed May 22 2024', 450),
(33, 6, '32949', 4, 'Wed May 22 2024', 1400),
(34, 5, '32949', 1, 'Wed May 22 2024', 150),
(35, 5, '38889', 1, 'Wed May 22 2024', 150),
(36, 6, '38889', 1, 'Wed May 22 2024', 350),
(37, 4, '38662', 4, 'Wed May 22 2024', 800),
(38, 6, '38662', 1, 'Wed May 22 2024', 350);

-- --------------------------------------------------------

--
-- Table structure for table `facture_achat`
--

CREATE TABLE `facture_achat` (
  `id_fac_A` int(11) NOT NULL,
  `date_liv` varchar(18) NOT NULL,
  `produit` varchar(30) NOT NULL,
  `prix` int(11) NOT NULL,
  `num_cmd` int(11) NOT NULL,
  `id_four` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facture_achat`
--

INSERT INTO `facture_achat` (`id_fac_A`, `date_liv`, `produit`, `prix`, `num_cmd`, `id_four`) VALUES
(34, 'Tue May 21 2', 'heloo', 13, 37646, 42),
(35, 'Tue May 21 2', 'med1', 17, 37646, 42),
(36, 'Tue May 21 2', 'parasitamol', 19, 37646, 42);

-- --------------------------------------------------------

--
-- Table structure for table `factur_vent_dist`
--

CREATE TABLE `factur_vent_dist` (
  `id_dist` int(11) NOT NULL,
  `id_fac` int(11) NOT NULL,
  `address_fac` varchar(30) NOT NULL,
  `date_liv` varchar(12) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `factur_vent_dist`
--

INSERT INTO `factur_vent_dist` (`id_dist`, `id_fac`, `address_fac`, `date_liv`) VALUES
(1, 22779, 'Constantine', '2024-05-21'),
(2, 36720, 'touggourt', 'Wed May 22 2'),
(3, 32949, 'anabba', 'Wed May 22 2'),
(4, 32949, 'anabba', 'Wed May 22 2');

-- --------------------------------------------------------

--
-- Table structure for table `medicament_approuve`
--

CREATE TABLE `medicament_approuve` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `type` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medicament_approuve`
--

INSERT INTO `medicament_approuve` (`id`, `name`, `type`) VALUES
(13, 'medication 1', 'with'),
(15, 'med1', 'with'),
(16, 'parasitamol', 'without');

-- --------------------------------------------------------

--
-- Table structure for table `ordonnace`
--

CREATE TABLE `ordonnace` (
  `id_or` int(11) NOT NULL,
  `date` varchar(12) NOT NULL,
  `id_c` int(11) NOT NULL,
  `medicament` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ordonnace`
--

INSERT INTO `ordonnace` (`id_or`, `date`, `id_c`, `medicament`) VALUES
(1, '0', 17, 'medicament n°1.\nmedicament n 2.\nmedicament n 3.'),
(2, 'Mon May 20 2', 18, 'Lisinopril.  \nMetformin.   \nAtorvastatin. \n'),
(3, 'Wed May 22 2', 19, 'medicament n°1.\nmedicament n 2.\nmedicament n 3.');

-- --------------------------------------------------------

--
-- Table structure for table `stock`
--

CREATE TABLE `stock` (
  `id_s` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `type` varchar(20) NOT NULL,
  `price` double NOT NULL,
  `qte_stock` int(11) NOT NULL,
  `date_per` varchar(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock`
--

INSERT INTO `stock` (`id_s`, `nom`, `type`, `price`, `qte_stock`, `date_per`) VALUES
(4, 'med 1', 'with', 200, 193, '2024-06-08'),
(5, 'alcohol', 'without', 150, 40, '2024-05-30'),
(6, 'serang', 'without', 350, 2992, '2024-07-31');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_ut` int(11) NOT NULL,
  `email` varchar(40) NOT NULL,
  `password` varchar(20) NOT NULL,
  `num_tel` int(10) NOT NULL,
  `role` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_ut`, `email`, `password`, `num_tel`, `role`) VALUES
(40, 'nadjib@gmail.com', 'nono', 9876543, 'pharmacien'),
(41, 'ndjbchch@gmail.com', 'manager', 987654, 'manager'),
(42, 'alaoui@gmail.com', 'alaa', 543213421, 'fournisseur'),
(43, 'baset@hala.com', 'setto', 654235120, 'vendeur'),
(44, 'karimbenSaidi@gmail.com', 'karim', 654321254, 'fournisseur');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carte_chifa`
--
ALTER TABLE `carte_chifa`
  ADD PRIMARY KEY (`id_cart`);

--
-- Indexes for table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id_C`);

--
-- Indexes for table `commande_achat`
--
ALTER TABLE `commande_achat`
  ADD PRIMARY KEY (`id_cmd`),
  ADD KEY `four_cmd` (`id_four`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `facture`
--
ALTER TABLE `facture`
  ADD PRIMARY KEY (`id_fac`),
  ADD KEY `fact_stock` (`id_stock`);

--
-- Indexes for table `facture_achat`
--
ALTER TABLE `facture_achat`
  ADD PRIMARY KEY (`id_fac_A`),
  ADD KEY `facAch_cmd` (`num_cmd`);

--
-- Indexes for table `factur_vent_dist`
--
ALTER TABLE `factur_vent_dist`
  ADD PRIMARY KEY (`id_dist`),
  ADD KEY `fact_dist` (`id_fac`);

--
-- Indexes for table `medicament_approuve`
--
ALTER TABLE `medicament_approuve`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ordonnace`
--
ALTER TABLE `ordonnace`
  ADD PRIMARY KEY (`id_or`),
  ADD KEY `id_c` (`id_c`);

--
-- Indexes for table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`id_s`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_ut`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carte_chifa`
--
ALTER TABLE `carte_chifa`
  MODIFY `id_cart` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `client`
--
ALTER TABLE `client`
  MODIFY `id_C` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `commande_achat`
--
ALTER TABLE `commande_achat`
  MODIFY `id_cmd` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `facture`
--
ALTER TABLE `facture`
  MODIFY `id_fac` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `facture_achat`
--
ALTER TABLE `facture_achat`
  MODIFY `id_fac_A` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `factur_vent_dist`
--
ALTER TABLE `factur_vent_dist`
  MODIFY `id_dist` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `medicament_approuve`
--
ALTER TABLE `medicament_approuve`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `ordonnace`
--
ALTER TABLE `ordonnace`
  MODIFY `id_or` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `stock`
--
ALTER TABLE `stock`
  MODIFY `id_s` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_ut` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `commande_achat`
--
ALTER TABLE `commande_achat`
  ADD CONSTRAINT `four_cmd` FOREIGN KEY (`id_four`) REFERENCES `users` (`id_ut`);

--
-- Constraints for table `facture`
--
ALTER TABLE `facture`
  ADD CONSTRAINT `fact_stock` FOREIGN KEY (`id_stock`) REFERENCES `stock` (`id_s`);

--
-- Constraints for table `ordonnace`
--
ALTER TABLE `ordonnace`
  ADD CONSTRAINT `ordonnace_ibfk_1` FOREIGN KEY (`id_c`) REFERENCES `client` (`id_C`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
