<?php set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Anatomy and Physiology Quizzes</title>
    <? include('generic.php'); ?>
    <link rel='stylesheet' href='css/AnP.css'>
</head>
<body>
    <h1>Anatomy and Physiology Quizzes</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
            <p>Select an Anatomy and Physiology Visual Quiz</p>
            <div class='category'>
                <h3>Chemistry</h3>
                <ul>
                <li><a href='Quiz.php?page=AminoAcids1'>Amino Acids</a></li>
                </ul>
            </div>
            <div class='category'>
                <h3>Introduction to AnP</h3>
                <ul>
                <li><a href='Quiz.php?page=Introduction1A'>Directional Terms 1</a></li>
                <li><a href='Quiz.php?page=Introduction1B'>Directional Terms 2</a></li>
                <li><a href='Quiz.php?page=Introduction2'>Body Region Names</a></li>
                <li><a href='Quiz.php?page=Introduction3'>Body Planes</a></li>
                <li><a href='Quiz.php?page=Introduction4'>Body Cavities</a></li>
                <li><a href='Quiz.php?page=Introduction5'>An Assortment of Cell Types</a></li>
                <li><a href='Quiz.php?page=IntroductionNineRegions1'>Nine Abdominal Region Names</a></li>
                <li><a href='Quiz.php?page=Cells1'>Parts of a Cell</a></li>
                </ul>
            </div>
            <div class='category'>
                <h3>Tissues</h3>
                <ul>
                <li><a href='Quiz.php?page=Tissues1'>Types of Glands</a></li>
                <li><a href='Quiz.php?page=Tissues2'>Components of Connective Tissue</a></li>
                <li><a href='Quiz.php?page=TissuesEpithelium'>Types of Epithelium</a></li>
                <li><a href='Quiz.php?page=TissueSlides1'>Microscope Slides 1</a></li>
                <li><a href='Quiz.php?page=TissueSlides2'>Microscope Slides 2</a></li>
                <li><a href='Quiz.php?page=TissueLocations1'>Locations of Tissue Subtypes</a></li>
                </ul>
            </div>
            <div class='category'>
                <h3>Integumentary System</h3>
                <ul>
                <li><a href='Quiz.php?page=Integumentary1'>Parts of the Integument</a></li>
                <li><a href='Quiz.php?page=IntegumentaryStrata1'>Strata of the Integument</a></li>
                <li><a href='Quiz.php?page=IntegumentaryNail1'>Nails</a></li>
                <li><a href='Quiz.php?page=IntegumentaryHair1'>Schematic Diagram of Hair</a></li>
                <li><a href='Quiz.php?page=IntegumentaryHair2'>Cross-sectional View of Hair</a></li>
                <li><a href='Quiz.php?page=IntegumentaryHair3'>Longitudinal View of Hair</a></li>
                </ul>
            </div>
            <div class='category'>
                <h3>Skeletal System</h3>
                <ul>
                <li><a href='Quiz.php?page=Bones1'>Epiphyseal Plate Regions</a></li>
                <li><a href='Quiz.php?page=SkeletonBoneMarkings1'>Bone Markings 1</a></li>
                <li><a href='Quiz.php?page=SkeletonBoneMarkings2'>Bone Markings 2</a></li>
                <li><a href='Quiz.php?page=Skeleton1'>Major Bones 1</a></li>
                <li><a href='Quiz.php?page=Skeleton2'>Cranial Bones and Cavities</a></li>
                <li><a href='Quiz.php?page=SkeletonSkull1A'>Skull 1A (Anterior View)</a></li>
                <li><a href='Quiz.php?page=SkeletonSkull1B'>Skull 1B (Posterior View)</a></li>
                <li><a href='Quiz.php?page=SkeletonSkull2'>Skull 2 (Side View)</a></li>
                <li><a href='Quiz.php?page=SkeletonSkull3'>Skull 3 (Interior Side View)</a></li>
                <li><a href='Quiz.php?page=SkeletonSkull4'>Skull 4 (Inferior View)</a></li>
                <li><a href='Quiz.php?page=SkeletonSkull5'>Skull 5 (Inferior View - Real)</a></li>
                <li><a href='Quiz.php?page=SkeletonSkull6'>Skull 6 (Superior Internal View)</a></li>
                <li><a href='Quiz.php?page=SkeletonSkull7'>Skull 7 (Superior Internal View - Real)</a></li>
                <li><a href='Quiz.php?page=SkeletonEthmoidBone1'>Ethmoid Bone Parts</a></li>
                <li><a href='Quiz.php?page=SkeletonSphenoidBone1'>Sphenoid Bone Parts</a></li>
                <li><a href='Quiz.php?page=SkeletonTemporalBone1'>Temporal Bone Parts</a></li>
                </ul>
            </div>
            <div class='category'>
                <h3>Skeletal System 2</h3>
                <ul>
                <li><a href='Quiz.php?page=SkeletonMandible'>Mandible</a></li>
                <li><a href='Quiz.php?page=SkeletonMaxilla'>Maxilla</a></li>
                <li><a href='Quiz.php?page=SkeletonNasalCavity1'>Nasal Cavity 1</a></li>
                <li><a href='Quiz.php?page=SkeletonNasalCavity2'>Nasal Cavity 2</a></li>
                <li><a href='Quiz.php?page=SkeletonOrbit'>Orbit</a></li>
                <li><a href='Quiz.php?page=SkeletonRibs1'>Ribs 1</a></li>
                <li><a href='Quiz.php?page=SkeletonRibs2Vertebra'>Ribs 2 (Vertebral Connection)</a></li>
                <li><a href='Quiz.php?page=SkeletonThoracicCage'>Thoracic Cage</a></li>
                <li><a href='Quiz.php?page=SkeletonVertebra1'>Vertebra 1</a></li>
                <li><a href='Quiz.php?page=SkeletonVertebra2'>Vertebra 2</a></li>
                <li><a href='Quiz.php?page=SkeletonVertebra3'>Vertebra 3</a></li>
                <li><a href='Quiz.php?page=SkeletonVertebra4'>Vertebra 4</a></li>
                <li><a href='Quiz.php?page=SkeletonAtlas'>Atlas (C1)</a></li>
                <li><a href='Quiz.php?page=SkeletonAxis'>Axis (C2)</a></li>
                <li><a href='Quiz.php?page=SkeletonSacrum'>Sacrum</a></li>
                </ul>
            </div>
            <div class='category'>
                <h3>Skeletal System 3</h3>
                <ul>
                <li><a href='Quiz.php?page=SkeletonScapula1'>Scapula (Anterior/Posterior Views)</a></li>
                <li><a href='Quiz.php?page=SkeletonScapula2'>Scapula (Lateral View)</a></li>
                <li><a href='Quiz.php?page=SkeletonHumerus'>Humerus</a></li>
                <li><a href='Quiz.php?page=SkeletonAnteriorElbow'>Anterior Elbow</a></li>
                <li><a href='Quiz.php?page=SkeletonPosteriorElbow'>Posterior Elbow</a></li>
                <li><a href='Quiz.php?page=SkeletonForearm1'>Radius and Ulna</a></li>
                <li><a href='Quiz.php?page=SkeletonForearm2'>Proximal and Distal Forearm</a></li>
                <li><a href='Quiz.php?page=SkeletonHand'>Hand</a></li>
                <li><a href='Quiz.php?page=SkeletonHipBone1'>Hip Bone (Anterior View)</a></li>
                <li><a href='Quiz.php?page=SkeletonHipBone2'>Hip Bone (Lateral and Medial View)</a></li>
                <li><a href='Quiz.php?page=SkeletonHipBone3'>Real Hip Bone (Lateral and Medial View)</a></li>
                <li><a href='Quiz.php?page=SkeletonFemur'>Femur</a></li>
                <li><a href='Quiz.php?page=SkeletonTibiaFibula'>Tibia and Fibula</a></li>
                <li><a href='Quiz.php?page=SkeletonFoot'>Foot</a></li>
                </ul>
            </div>
            <div class='category'>
                <h3>Musclular System</h3>
                <ul>
                <li><a href='Quiz.php?page=Muscular1A'>Major Muscles Superior Anterior</a></li>
                <li><a href='Quiz.php?page=Muscular1B'>Major Muscles Inferior Anterior</a></li>
                <li><a href='Quiz.php?page=Muscular2A'>Major Muscles Superior Posterior</a></li>
                <li><a href='Quiz.php?page=Muscular2B'>Major Muscles Inferior Posterior</a></li>
                <li><a href='Quiz.php?page=MusclesFacial'>Facial Muscles</a></li>
                <li><a href='Quiz.php?page=MusclesMasticationAndTongue'>Tongue Muscles and Muscles of Mastication</a></li>
                <li><a href='Quiz.php?page=MusclesAnteriorNeck'>Muscles of the Anterior Neck</a></li>
                <li><a href='Quiz.php?page=MusclesNeck'>Muscles of the Anterior and Posterior Neck</a></li>
                <li><a href='Quiz.php?page=MusclesThroat'>Muscles of the Throat</a></li>
                <li><a href='Quiz.php?page=MusclesSpinalErectors'>Spinal Erectors</a></li>
                <li><a href='Quiz.php?page=MusclesRespiration'>Muscles of Respiration</a></li>
                <li><a href='Quiz.php?page=MusclesAbdomen'>Muscles of the Anterior Abdominal Wall</a></li>
                <li><a href='Quiz.php?page=MusclesPelvicFloor'>Muscles of the Pelvic Floor</a></li>
                <li><a href='Quiz.php?page=MusclesAnteriorThorax'>Muscles of the Anterior Thorax</a></li>
                <li><a href='Quiz.php?page=MusclesBack'>Back Muscles</a></li>
                </ul>
            </div>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
